import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import openai from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || typeof user !== "object" || !("id" in user)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { documentId, count = 10 } = await req.json();

    if (!documentId) {
      return new NextResponse("Document ID is required", { status: 400 });
    }

    // Fetch the document to ensure it exists and belongs to the user
    const document = await db.document.findUnique({
      where: {
        id: documentId,
        userId: user.id as string,
      },
    });

    if (!document) {
      return new NextResponse("Document not found", { status: 404 });
    }

    // Try to create AI-generated flashcards, with fallback to sample flashcards
    let aiResponse = "";
    let flashcards = [];

    try {
      // Call OpenAI API to generate flashcards using gpt-3.5-turbo
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are an expert educational assistant that creates high-quality study flashcards. 
            Your flashcards should be:
            1. Specific and detailed - avoid generic questions
            2. Based on actual content from the document
            3. Include clear, concise answers
            4. Vary in difficulty appropriately
            5. Never reference the document title directly in questions
            6. Focus on key concepts, definitions, and important details`,
          },
          {
            role: "user",
            content: `Generate ${count} high-quality flashcards based on the document titled "${document.title}".
            
            For each flashcard, follow this exact format:
            
            FRONT: [Specific question or concept]
            BACK: [Clear, concise answer]
            DIFFICULTY: [easy/medium/hard]
            SOURCE: [Relevant text from the document]
            
            Guidelines:
            1. Questions should be specific and test understanding
            2. Answers should be comprehensive but concise
            3. Include source text to verify accuracy
            4. Vary difficulty levels appropriately
            5. Never use placeholder text or generic questions`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      aiResponse = response.choices[0]?.message?.content || "";
      flashcards = parseFlashcardsFromAI(aiResponse);
    } catch (aiError) {
      console.error("[OPENAI_API_ERROR]", aiError);

      // Fallback to creating sample flashcards if OpenAI call fails
      flashcards = [
        {
          front: "What are the main components discussed in this document?",
          back: "This is a sample flashcard. The actual answer would contain information from your document.",
          difficulty: "medium",
          source: "AI generation failed, this is a fallback flashcard.",
        },
        {
          front: "Describe the key principles outlined in the document",
          back: "This is another sample answer. The OpenAI API encountered an error.",
          difficulty: "medium",
          source: "AI generation failed, this is a fallback flashcard.",
        },
      ];
    }

    // Save the flashcards to the database
    const savedFlashcards = await Promise.all(
      flashcards.map((flashcard) =>
        db.flashcard.create({
          data: {
            front: flashcard.front,
            back: flashcard.back,
            difficulty: flashcard.difficulty || "medium",
            sourceText: flashcard.source || "",
            documentId: document.id,
            status: "new",
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      flashcards: savedFlashcards,
    });
  } catch (error) {
    console.error("[FLASHCARDS_GENERATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Helper function to parse flashcards from AI response
function parseFlashcardsFromAI(text: string) {
  const flashcards = [];

  // Use a simpler regex pattern that's compatible with ES2015
  const regex =
    /FRONT:\s*([\s\S]+?)(?:\n|$)BACK:\s*([\s\S]+?)(?:\n|$)DIFFICULTY:\s*([\s\S]+?)(?:\n|$)SOURCE:\s*([\s\S]+?)(?:\n\n|$)/g;

  let match;
  while ((match = regex.exec(text)) !== null) {
    flashcards.push({
      front: match[1]?.trim() || "",
      back: match[2]?.trim() || "",
      difficulty: match[3]?.trim().toLowerCase() || "medium",
      source: match[4]?.trim() || "",
    });
  }

  // If regex failed to match, try to extract flashcards as best we can
  if (flashcards.length === 0) {
    const sections = text.split(/\n\n+/);

    for (const section of sections) {
      const lines = section.split("\n");
      const front = lines
        .find((l) => l.startsWith("FRONT:"))
        ?.replace("FRONT:", "")
        .trim();
      const back = lines
        .find((l) => l.startsWith("BACK:"))
        ?.replace("BACK:", "")
        .trim();

      if (front && back) {
        const difficulty =
          lines
            .find((l) => l.startsWith("DIFFICULTY:"))
            ?.replace("DIFFICULTY:", "")
            .trim()
            .toLowerCase() || "medium";
        const source =
          lines
            .find((l) => l.startsWith("SOURCE:"))
            ?.replace("SOURCE:", "")
            .trim() || "";

        flashcards.push({ front, back, difficulty, source });
      }
    }
  }

  return flashcards;
}

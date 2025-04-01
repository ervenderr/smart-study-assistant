import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || typeof user !== "object" || !("id" in user)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get("documentId");

    if (!documentId) {
      return new NextResponse("Document ID is required", { status: 400 });
    }

    // Verify the document belongs to the user
    const document = await db.document.findUnique({
      where: {
        id: documentId,
        userId: user.id,
      },
    });

    if (!document) {
      return new NextResponse("Document not found", { status: 404 });
    }

    // Fetch flashcards for the document
    const flashcards = await db.flashcard.findMany({
      where: {
        documentId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(flashcards);
  } catch (error) {
    console.error("[FLASHCARDS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || typeof user !== "object" || !("id" in user)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get("documentId");

    if (!documentId) {
      return new NextResponse("Document ID is required", { status: 400 });
    }

    // Verify the document belongs to the user
    const document = await db.document.findUnique({
      where: {
        id: documentId,
        userId: user.id,
      },
    });

    if (!document) {
      return new NextResponse("Document not found", { status: 404 });
    }

    // Delete all flashcards for the document
    await db.flashcard.deleteMany({
      where: {
        documentId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "All flashcards deleted successfully",
    });
  } catch (error) {
    console.error("[FLASHCARDS_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

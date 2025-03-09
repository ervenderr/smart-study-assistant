import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import * as z from "zod";

const documentCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  fileUrl: z.string().url("Invalid file URL"),
  fileType: z.string(),
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    console.log("[DOCUMENT_CREATE] Current user:", user);

    if (!user?.id) {
      return NextResponse.json(
        { message: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }

    // Verify user exists in database
    const dbUser = await db.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      console.error("[DOCUMENT_CREATE] User not found in database:", user.id);
      return NextResponse.json(
        { message: "User not found in database" },
        { status: 401 }
      );
    }

    const json = await req.json();
    console.log("[DOCUMENT_CREATE] Request body:", json);

    const body = documentCreateSchema.parse(json);
    console.log("[DOCUMENT_CREATE] Validated body:", body);

    // Create document with verified user
    const document = await db.document.create({
      data: {
        title: body.title,
        fileUrl: body.fileUrl,
        fileType: body.fileType,
        userId: dbUser.id,
        content: "", // We'll update this after processing the document
      },
    });

    console.log("[DOCUMENT_CREATE] Created document:", document);
    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("[DOCUMENT_CREATE] Error details:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }

    // Check for specific Prisma errors
    if (
      error instanceof Error &&
      error.message.includes("Foreign key constraint")
    ) {
      return NextResponse.json(
        {
          message:
            "User authentication error. Please try logging out and back in.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}

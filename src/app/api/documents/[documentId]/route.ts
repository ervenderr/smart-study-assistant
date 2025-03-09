import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { documentId: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const document = await db.document.findUnique({
      where: {
        id: params.documentId,
        userId: user.id,
      },
    });

    if (!document) {
      return new NextResponse("Not found", { status: 404 });
    }

    await db.document.delete({
      where: {
        id: params.documentId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[DOCUMENT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

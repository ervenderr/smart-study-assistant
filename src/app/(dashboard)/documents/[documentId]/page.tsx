import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { DocumentViewer } from "@/components/documents/document-viewer";
import { DocumentActions } from "@/components/documents/document-actions";

interface DocumentPageProps {
  params: {
    documentId: string;
  };
}

export default async function DocumentPage({ params }: DocumentPageProps) {
  const user = await getCurrentUser();

  if (!user?.id) {
    return null;
  }

  const document = await db.document.findUnique({
    where: {
      id: params.documentId,
      userId: user.id,
    },
    include: {
      course: true,
    },
  });

  if (!document) {
    notFound();
  }

  return (
    <div className="flex flex-col space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {document.title}
          </h2>
          {document.course && (
            <p className="text-muted-foreground">
              Course: {document.course.title}
            </p>
          )}
        </div>
        <DocumentActions document={document} />
      </div>
      <DocumentViewer document={document} />
    </div>
  );
}

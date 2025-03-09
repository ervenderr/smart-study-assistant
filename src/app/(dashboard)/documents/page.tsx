import { DocumentUpload } from "@/components/documents/document-upload";
import { DocumentList } from "@/components/documents/document-list";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export default async function DocumentsPage() {
  const user = await getCurrentUser();

  if (!user?.id) {
    return null;
  }

  const documents = await db.document.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { course: true },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
          <p className="text-muted-foreground">
            Upload and manage your study materials
          </p>
        </div>
        <DocumentUpload />
      </div>
      <DocumentList documents={documents} />
    </div>
  );
} 
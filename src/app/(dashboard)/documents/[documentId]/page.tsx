import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { DocumentViewer } from "@/components/documents/document-viewer";
import { DocumentActions } from "@/components/documents/document-actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { FlashcardSection } from "@/components/flashcards/flashcard-section";

interface DocumentPageProps {
  params: {
    documentId: string;
  };
}

export default async function DocumentPage({ params }: DocumentPageProps) {
  // Store params in a separate variable to ensure it's awaited
  const { documentId } = params;

  const user = await getCurrentUser();

  if (!user?.id) {
    return null;
  }

  const document = await db.document.findUnique({
    where: {
      id: documentId,
      userId: user.id,
    },
    include: {
      course: true,
    },
  });

  if (!document) {
    notFound();
  }

  // Get flashcards for the document
  const flashcards = await db.flashcard.findMany({
    where: {
      documentId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

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

      <Tabs defaultValue="document" className="w-full">
        <TabsList>
          <TabsTrigger value="document">Document</TabsTrigger>
          <TabsTrigger value="flashcards">
            Flashcards ({flashcards.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="document" className="mt-4">
          <DocumentViewer document={document} />
        </TabsContent>
        <TabsContent value="flashcards" className="mt-4">
          <FlashcardSection
            documentId={documentId}
            initialFlashcards={flashcards}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Flashcard } from "@prisma/client";
import { FlashcardList } from "@/components/flashcards/flashcard-list";
import { GenerateFlashcardsButton } from "@/components/flashcards/generate-flashcards-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brain, FilterIcon, Plus, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface FlashcardSectionProps {
  documentId: string;
  initialFlashcards: Flashcard[];
}

export function FlashcardSection({
  documentId,
  initialFlashcards,
}: FlashcardSectionProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(initialFlashcards);
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const fetchFlashcards = async () => {
    try {
      const response = await fetch(`/api/flashcards?documentId=${documentId}`);
      if (response.ok) {
        const data = await response.json();
        setFlashcards(data);
      }
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    }
  };

  // Handle successful flashcard generation
  const handleGenerateSuccess = () => {
    fetchFlashcards();
  };

  // Toggle study mode
  const toggleStudyMode = () => {
    setIsStudyMode(!isStudyMode);
  };

  // Delete all flashcards for this document
  const deleteAllFlashcards = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/flashcards?documentId=${documentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("All flashcards deleted successfully");
        setFlashcards([]);
        router.refresh();
      } else {
        toast.error("Failed to delete flashcards");
      }
    } catch (error) {
      toast.error("An error occurred while deleting flashcards");
      console.error("Error deleting flashcards:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      {flashcards.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Generate Flashcards</CardTitle>
            <CardDescription>
              No flashcards have been created for this document yet. Generate
              some flashcards to start studying.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GenerateFlashcardsButton
              documentId={documentId}
              onSuccess={handleGenerateSuccess}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">
              {flashcards.length} Flashcards Available
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={toggleStudyMode}
              >
                <Brain className="h-4 w-4" />
                {isStudyMode ? "Exit Study Mode" : "Study Mode"}
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 text-destructive"
                  >
                    <Trash className="h-4 w-4" />
                    Delete All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete All Flashcards</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete all flashcards for this document? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={deleteAllFlashcards}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete All"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <GenerateFlashcardsButton
                documentId={documentId}
                onSuccess={handleGenerateSuccess}
                count={5}
              />
            </div>
          </div>

          <Separator />

          {isStudyMode ? (
            <FlashcardList flashcards={flashcards} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {flashcards.map((flashcard) => (
                <Card
                  key={flashcard.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      {flashcard.front}
                    </CardTitle>
                    <div className="flex justify-between items-center">
                      <CardDescription className="text-xs">
                        Created:{" "}
                        {new Date(flashcard.createdAt).toLocaleDateString()}
                      </CardDescription>
                      <span className="text-xs bg-muted px-2 py-1 rounded-full">
                        {flashcard.difficulty}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2 text-sm">
                    {flashcard.back}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

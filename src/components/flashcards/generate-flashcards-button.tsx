"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

interface GenerateFlashcardsButtonProps {
  documentId: string;
  count?: number;
  onSuccess?: () => void;
}

export function GenerateFlashcardsButton({
  documentId,
  count = 10,
  onSuccess,
}: GenerateFlashcardsButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const router = useRouter();

  const handleGenerateFlashcards = async () => {
    try {
      setIsLoading(true);
      toast.info("Generating flashcards. This may take a moment...");

      const response = await fetch("/api/flashcards/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId,
          count,
        }),
      });

      // Handle different response statuses appropriately
      if (response.status === 401) {
        toast.error("You are not authorized to perform this action");
        return;
      }
      
      if (response.status === 404) {
        toast.error("Document not found");
        return;
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error:", response.status, errorText);
        
        // More informative error message
        let errorMessage = "Failed to generate flashcards";
        if (errorText) {
          errorMessage += `: ${errorText}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (data.success) {
        toast.success(`Generated ${data.flashcards.length} flashcards!`);
        router.refresh();
        onSuccess?.();
        setRetryCount(0); // Reset retry count on success
      } else {
        throw new Error("Failed to generate flashcards");
      }
    } catch (error) {
      console.error("Error generating flashcards:", error);
      
      // Provide more detailed error message
      const errorMessage = error instanceof Error
        ? error.message
        : "An error occurred while generating flashcards";
      
      toast.error(errorMessage);
      
      // Increment retry count for tracking
      setRetryCount(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGenerateFlashcards}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
      {isLoading ? "Generating..." : "Generate Flashcards"}
    </Button>
  );
}

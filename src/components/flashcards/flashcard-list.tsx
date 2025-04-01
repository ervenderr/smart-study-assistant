"use client";

import { useState } from "react";
import { Flashcard } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlashcardListProps {
  flashcards: Flashcard[];
}

export function FlashcardList({ flashcards }: FlashcardListProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlipped(false);
    }
  };

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  if (!flashcards.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground mb-4">
          No flashcards available for this document yet.
        </p>
      </div>
    );
  }

  const currentFlashcard = flashcards[currentIndex];

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-xl mx-auto">
      <div className="text-sm text-muted-foreground">
        Flashcard {currentIndex + 1} of {flashcards.length}
      </div>

      <div className="w-full max-w-xl perspective-1000" onClick={handleFlip}>
        <div
          className={cn(
            "relative w-full aspect-[3/2] transition-all duration-500 transform cursor-pointer",
            flipped ? "rotate-y-180" : ""
          )}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front side */}
          <Card
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center p-6 backface-hidden",
              flipped ? "opacity-0" : "opacity-100"
            )}
          >
            <div className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full bg-muted">
              {currentFlashcard.difficulty}
            </div>
            <div className="w-full text-center">
              <h3 className="text-xl font-medium">{currentFlashcard.front}</h3>
              <p className="mt-4 text-sm text-muted-foreground">Tap to flip</p>
            </div>
          </Card>

          {/* Back side */}
          <Card
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center p-6 backface-hidden rotate-y-180",
              flipped ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="w-full h-full overflow-auto">
              <p className="text-lg mb-4">{currentFlashcard.back}</p>
              {currentFlashcard.sourceText && (
                <div className="mt-4 text-xs text-muted-foreground p-2 border-t">
                  <p className="font-medium">Source:</p>
                  <p>{currentFlashcard.sourceText}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-between w-full">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button variant="outline" onClick={handleFlip}>
          {flipped ? "Show Question" : "Show Answer"}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

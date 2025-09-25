import { useState, useEffect } from "react";
import { Container, Text, Group, Button, Center } from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import type { Word } from "../App";
import { SpinnerCard } from "../components/SpinnerCard";

interface StartLearningPageProps {
  category: string;
  onBack: () => void;
}

export function StartLearningPage({
  category,
  onBack,
}: StartLearningPageProps) {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch words when the component mounts
  useEffect(() => {
    const fetchWords = async () => {
      setIsLoading(true);
      try {
        const data = await import(`../data/${category}.json`);
        setWords(
          data.default.map((word: Omit<Word, "category">) => ({
            ...word,
            category,
          }))
        );
      } catch (error) {
        console.error("Failed to load words:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWords();
  }, [category]);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => Math.min(prev + 1, words.length - 1));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  if (isLoading) {
    return <Center style={{ height: "100vh" }}>Loading words...</Center>;
  }

  if (words.length === 0) {
    return (
      <Center style={{ height: "100vh" }}>
        No words found for this category.
      </Center>
    );
  }

  const currentWord = words[currentIndex];
  const showNavigation = words.length > 1;

  return (
    <Container
      size="sm"
      py="xl"
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      <Group justify="space-between" mb="xl">
        <Button
          variant="outline"
          leftSection={<IconArrowLeft />}
          onClick={onBack}
        >
          Back
        </Button>
        <Text>{`${currentIndex + 1} / ${words.length}`}</Text>
      </Group>

      {/* Card Flip Container */}
      <div style={{ flex: 1, perspective: "1000px" }}>
        <SpinnerCard
          word={currentWord}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped(!isFlipped)}
          showGender={true}
        />
      </div>

      {showNavigation && (
        <Group justify="center" mt="xl">
          <Button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            leftSection={<IconArrowLeft />}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentIndex === words.length - 1}
            rightSection={<IconArrowRight />}
          >
            Next
          </Button>
        </Group>
      )}
    </Container>
  );
}

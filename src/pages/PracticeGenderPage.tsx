import { useState, useEffect } from "react";
import {
  Container,
  Text,
  Group,
  Button,
  Center,
  SimpleGrid,
} from "@mantine/core";
import type { Word } from "../App";
import { SpinnerCard } from "../components/SpinnerCard";
import { AnswerAnimation } from "../components/AnswerAnimation";
import { IconArrowLeft } from "@tabler/icons-react";

type Article = "der" | "die" | "das";

interface PracticeGenderPageProps {
  category: string;
  onBack: () => void;
}

export function PracticeGenderPage({
  category,
  onBack,
}: PracticeGenderPageProps) {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [answerStatus, setAnswerStatus] = useState<
    "correct" | "incorrect" | null
  >(null);

  useEffect(() => {
    const fetchWords = async () => {
      setIsLoading(true);
      try {
        const data = await import(`../data/${category}.json`);
        const wordsWithArticles = data.default
          .filter((word: Word) => !!word.article)
          .map((word: Omit<Word, "category">) => ({
            ...word,
            category,
          }));
        setWords(wordsWithArticles);
      } catch (error) {
        console.error("Failed to load words:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWords();
  }, [category]);

  const handleGuess = (guess: Article) => {
    if (answerStatus) return;

    const correctArticle = words[currentIndex].article;

    if (guess === correctArticle) {
      setAnswerStatus("correct");
    } else {
      setAnswerStatus("incorrect");
    }
    setIsFlipped(true); // Automatically flip the card to show the correct answer
  };

  const handleNext = () => {
    setAnswerStatus(null);
    setIsFlipped(false);
    setCurrentIndex((prev) => Math.min(prev + 1, words.length - 1));
  };

  if (isLoading) {
    return <Center style={{ height: "100vh" }}>Loading words...</Center>;
  }

  if (words.length === 0) {
    return (
      <Center style={{ height: "100vh" }}>
        No words with articles found in this category.
      </Center>
    );
  }

  const currentWord = words[currentIndex];

  return (
    <Container
      size="sm"
      py="xl"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
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

      <div style={{ height: "400px", position: "relative" }}>
        <AnswerAnimation status={answerStatus} />
        <SpinnerCard
          word={currentWord}
          isFlipped={isFlipped}
          onFlip={() => answerStatus && setIsFlipped(!isFlipped)}
          showGender={!!answerStatus}
          speakArticle={!!answerStatus}
        />
      </div>

      <div
        style={{
          minHeight: "120px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {answerStatus ? (
          <Button
            onClick={handleNext}
            size="lg"
            disabled={currentIndex === words.length - 1}
          >
            Next Word
          </Button>
        ) : (
          <SimpleGrid cols={3} spacing="lg" style={{ width: "100%" }}>
            {(["der", "die", "das"] as Article[]).map((article) => (
              <Button
                key={article}
                onClick={() => handleGuess(article)}
                size="lg"
              >
                {article}
              </Button>
            ))}
          </SimpleGrid>
        )}
      </div>
    </Container>
  );
}

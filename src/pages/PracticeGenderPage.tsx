import { useState, useEffect } from "react";
import {
  Container,
  Title,
  Text,
  Group,
  Button,
  Center,
  SimpleGrid,
} from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import ConfettiExplosion from "react-confetti-explosion";
import type { Word } from "../App";
import { SpinnerCard } from "../components/SpinnerCard";
import { useWordStore } from "../store/store";
import type { MantineColor } from "@mantine/core";

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
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

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
    setSelectedArticle(guess);

    if (guess === correctArticle) {
      setAnswerStatus("correct");
    } else {
      setAnswerStatus("incorrect");
    }
    setIsFlipped(true); // Automatically flip the card to show the correct answer
  };

  const handleNext = () => {
    setAnswerStatus(null);
    setSelectedArticle(null);
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

  const bigExplodeProps = {
    force: 0.6,
    duration: 5000,
    particleCount: 200,
    floorHeight: 1600,
    floorWidth: 1600,
  };

  const getButtonColor = (article: Article): MantineColor => {
    if (!answerStatus) return "custom-retro";
    if (article === currentWord.article) return "custom-retro";
    if (article === selectedArticle) return "custom-retro";
    return "custom-retro";
  };

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
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Text>{`${currentIndex + 1} / ${words.length}`}</Text>
      </Group>

      <div style={{ flex: 1, perspective: "1000px", position: "relative" }}>
        <Center
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          {answerStatus === "correct" && (
            <ConfettiExplosion {...bigExplodeProps} />
          )}
          <AnimatePresence>
            {answerStatus === "incorrect" && (
              <motion.svg
                key="incorrect-cross"
                width="150"
                height="150"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 2, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <motion.path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="#FF6B6B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </Center>

        <SpinnerCard
          word={currentWord}
          isFlipped={isFlipped}
          onFlip={() => answerStatus && setIsFlipped(!isFlipped)}
          showGender={false}
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

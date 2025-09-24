import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Title,
  Text,
  Group,
  Button,
  ActionIcon,
  Center,
  SimpleGrid,
} from "@mantine/core";
import { IconVolume, IconStar } from "@tabler/icons-react";
import { motion } from "framer-motion";
import ConfettiExplosion from "react-confetti-explosion";

type Article = "der" | "die" | "das";

interface Word {
  id: string;
  german: string;
  article?: Article;
  english: string;
}

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
        const wordsWithArticles = data.default.filter(
          (word: Word) => !!word.article
        );
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
  };

  const handleNext = () => {
    setAnswerStatus(null);
    setSelectedArticle(null);
    setIsFlipped(false);
    setCurrentIndex((prev) => Math.min(prev + 1, words.length - 1));
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "de-DE";
    window.speechSynthesis.speak(utterance);
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

  const bigExplodeProps = {
    force: 0.6,
    duration: 5000,
    particleCount: 200,
    floorHeight: 1600,
    floorWidth: 1600,
  };

  const currentWord = words[currentIndex];

  const getButtonColor = (article: Article) => {
    if (!answerStatus) return "gray";
    if (article === currentWord.article) return "green";
    if (article === selectedArticle) return "red";
    return "gray";
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

      {/* The card flip container is the positioning anchor for the overlay */}
      <div
        style={{ flex: 1, perspective: "1000px", position: "relative" }}
        onClick={() => answerStatus && setIsFlipped(!isFlipped)}
      >
        {/* This Center component creates the full-screen overlay */}
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
          {answerStatus === "incorrect" && (
            <svg
              width="150"
              height="150"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M18 6L6 18M6 6l12 12"
                stroke="#FF6B6B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              />
            </svg>
          )}
        </Center>

        <motion.div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            transformStyle: "preserve-3d",
          }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper
            shadow="md"
            p="xl"
            radius="md"
            withBorder
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActionIcon
              variant="transparent"
              size="lg"
              style={{ position: "absolute", top: 10, left: 10 }}
              onClick={(e) => {
                e.stopPropagation();
                speak(currentWord.german);
              }}
            >
              <IconVolume />
            </ActionIcon>
            <ActionIcon
              variant="transparent"
              size="lg"
              style={{ position: "absolute", top: 10, right: 10 }}
              onClick={(e) => {
                e.stopPropagation();
                alert("Bookmark clicked!");
              }}
            >
              <IconStar />
            </ActionIcon>
            <Title order={1} ta="center">
              {currentWord.german}
            </Title>
          </Paper>

          <Paper
            shadow="md"
            p="xl"
            radius="md"
            withBorder
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Title order={2} ta="center">
              {currentWord.english}
            </Title>
          </Paper>
        </motion.div>
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
                color={getButtonColor(article)}
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

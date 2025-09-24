import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Title,
  Text,
  Group,
  Button,
  Center,
  TextInput,
} from "@mantine/core";
import { motion } from "framer-motion";
import ConfettiExplosion from "react-confetti-explosion";

interface Word {
  id: string;
  german: string;
  article?: "der" | "die" | "das";
  english: string;
}

interface PracticeTypingPageProps {
  category: string;
  onBack: () => void;
}

export function PracticeTypingPage({
  category,
  onBack,
}: PracticeTypingPageProps) {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [userInput, setUserInput] = useState("");
  const [answerStatus, setAnswerStatus] = useState<
    "correct" | "incorrect" | null
  >(null);

  useEffect(() => {
    const fetchWords = async () => {
      setIsLoading(true);
      try {
        const data = await import(`../data/${category}.json`);
        setWords(data.default);
      } catch (error) {
        console.error("Failed to load words:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWords();
  }, [category]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (answerStatus) return; // Prevent multiple submissions

    const correctAnswer = (`${words[currentIndex].article} ${words[currentIndex].german}`).trim();
    debugger
    // Normalize answers for comparison
    if (userInput.trim().toLowerCase() === correctAnswer.toLowerCase()) {
      setAnswerStatus("correct");
    } else {
      setAnswerStatus("incorrect");
    }
    setIsFlipped(true); // Automatically flip the card to show the answer
  };

  const handleNext = () => {
    setAnswerStatus(null);
    setUserInput("");
    setIsFlipped(false);
    setCurrentIndex((prev) => Math.min(prev + 1, words.length - 1));
  };

  if (isLoading) return <Center h="100vh">Loading words...</Center>;
  if (words.length === 0)
    return <Center h="100vh">No words found for this category.</Center>;

  const currentWord = words[currentIndex];
  const fullGermanWord = currentWord.article
    ? `${currentWord.article} ${currentWord.german}`
    : currentWord.german;

  return (
    <Container
      size="sm"
      py="xl"
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
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
            inset: 0,
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          {answerStatus === "correct" && <ConfettiExplosion />}
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
          {/* Front of the Card (English) */}
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
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Title order={1} ta="center">
              {currentWord.english}
            </Title>
          </Paper>
          {/* Back of the Card (German) */}
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
              {fullGermanWord}
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
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Group>
              <TextInput
                style={{ flex: 1 }}
                placeholder="Type the German word..."
                size="lg"
                autoFocus
                value={userInput}
                onChange={(e) => setUserInput(e.currentTarget.value)}
              />
              <Button type="submit" size="lg">
                Submit
              </Button>
            </Group>
          </form>
        )}
      </div>
    </Container>
  );
}

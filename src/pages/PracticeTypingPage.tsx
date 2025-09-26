import { useState, useEffect } from "react";
import {
  Container,
  Text,
  Group,
  Button,
  Center,
  TextInput,
} from "@mantine/core";
import type { Word } from "../App";
import { SpinnerCard } from "../components/SpinnerCard";
import { AnswerAnimation } from "../components/AnswerAnimation";
import { IconArrowLeft } from "@tabler/icons-react";

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (answerStatus) return; // Prevent multiple submissions

    const correctAnswer =
      `${words[currentIndex].article} ${words[currentIndex].german}`.trim();

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

     <div style={{ height: "400px", position: "relative" }}>
        <AnswerAnimation status={answerStatus} />
        <SpinnerCard
          word={currentWord}
          isFlipped={!isFlipped}
          onFlip={() => answerStatus && setIsFlipped(!isFlipped)}
          showGender={true}
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

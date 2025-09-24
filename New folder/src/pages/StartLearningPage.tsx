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
} from "@mantine/core";
import {
  IconArrowLeft,
  IconArrowRight,
  IconVolume,
  IconStar,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

// Define the structure of a word object
interface Word {
  id: string;
  german: string;
  article?: "der" | "die" | "das";
  english: string;
}

interface StartLearningPageProps {
  category: string;
  onBack: () => void;
  initialWordId?: string | null;
}

export function StartLearningPage({
  category,
  onBack,
  initialWordId,
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
        setWords(data.default);

        // If an initial word is specified, find its index and set it
        if (initialWordId) {
          const startIndex = data.default.findIndex(
            (word: Word) => word.id === initialWordId
          );
          if (startIndex !== -1) {
            setCurrentIndex(startIndex);
          }
        }
      } catch (error) {
        console.error("Failed to load words:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWords();
  }, [category, initialWordId]);

  const handleNext = () => {
    setIsFlipped(false); // Flip back to the front for the next card
    setCurrentIndex((prev) => Math.min(prev + 1, words.length - 1));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
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
        No words found for this category.
      </Center>
    );
  }

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

      {/* Card Flip Container */}
      <div
        style={{ flex: 1, perspective: "1000px" }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
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
          {/* Front of the Card */}
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
                speak(fullGermanWord);
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
              {fullGermanWord}
            </Title>
          </Paper>

          {/* Back of the Card */}
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
    </Container>
  );
}

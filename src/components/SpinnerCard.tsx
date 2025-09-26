import { useState } from "react";
import { Paper, Title, ActionIcon } from "@mantine/core";
import { IconVolume, IconStarFilled, IconStar } from "@tabler/icons-react";
import { motion } from "framer-motion";
import type { Word } from "../App";
import { useWordStore } from "../store/store";
import { speak } from "../utils/speak";

interface SpinnerCardProps {
  word: Word;
  showGender: boolean;
  isFlipped?: boolean;
  onFlip?: () => void;
  speakArticle?: boolean;
}

export function SpinnerCard({
  word,
  isFlipped,
  onFlip,
  showGender,
  speakArticle,
}: SpinnerCardProps) {
  // Use internal state if not controlled by parent
  const [internalIsFlipped, setInternalIsFlipped] = useState(false);
  const isControlled = isFlipped !== undefined;
  const currentIsFlipped = isControlled ? isFlipped : internalIsFlipped;

  const { savedWords, saveWord, unsaveWord } = useWordStore();
  const isWordSaved = savedWords.some((w) => w.id === word.id);

  const fullGermanWord = word.article
    ? `${word.article} ${word.german}`
    : word.german;

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isWordSaved) {
      unsaveWord(word);
    } else {
      saveWord(word);
    }
  };

  const handleCardClick = () => {
    if (isControlled && onFlip) {
      onFlip();
    } else {
      setInternalIsFlipped(!internalIsFlipped);
    }
  };

  return (
    <motion.div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        transformStyle: "preserve-3d",
      }}
      animate={{ rotateY: currentIsFlipped ? 180 : 0 }}
      transition={{ duration: 0.6 }}
      onClick={handleCardClick}
      
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
            speakArticle
              ? speak(fullGermanWord)
              : speak(fullGermanWord.split(" ")[1]);
          }}
        >
          <IconVolume />
        </ActionIcon>
        <ActionIcon
          variant="transparent"
          size="lg"
          style={{ position: "absolute", top: 10, right: 10 }}
          onClick={handleBookmarkClick}
        >
          {isWordSaved ? <IconStarFilled /> : <IconStar />}
        </ActionIcon>
        <Title order={1} ta="center">
          {showGender ? fullGermanWord : word.german}
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
          {word.english}
        </Title>
      </Paper>
    </motion.div>
  );
}

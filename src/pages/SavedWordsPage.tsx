import React from "react";
import {
  Container,
  Paper,
  Title,
  Text,
  Group,
  Button,
  SimpleGrid,
  FileButton,
} from "@mantine/core";
import { IconArrowLeft, IconDownload, IconUpload } from "@tabler/icons-react";
import type { Word } from "../App";
import { useWordStore } from "../store/store";
import { SpinnerCard } from "../components/SpinnerCard";

interface SavedWordsPageProps {
  onBack: () => void;
}

export function SavedWordsPage({ onBack }: SavedWordsPageProps) {
  const { savedWords, allWords, saveWord } = useWordStore();

  const handleDownload = () => {
    const dataStr = JSON.stringify(savedWords);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "saved-words.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (file: File | null) => {
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsText(file, "UTF-8");
      fileReader.onload = (e) => {
        try {
          const content = JSON.parse(e.target?.result as string);
          if (Array.isArray(content)) {
            // Filter out words that are not in allWords to prevent data corruption
            const validWords = content.filter((importedWord) =>
              allWords.some((word) => word.id === importedWord.id)
            );
            // Save each valid word
            validWords.forEach((word) => saveWord(word));
          }
        } catch (error) {
          console.error("Failed to parse JSON file:", error);
          alert("Failed to import file. Please check the file format.");
        }
      };
    }
  };

  return (
    <Container size="md" py="xl">
      <Group justify="space-between" mb="xl">
        <Button
          variant="outline"
          onClick={onBack}
          leftSection={<IconArrowLeft />}
        >
          Back
        </Button>
        <Title order={1}>Saved Words</Title>
        <Group>
          <Button onClick={handleDownload} leftSection={<IconDownload />}>
            Download
          </Button>
          <FileButton onChange={handleImport} accept=".json">
            {(props) => (
              <Button {...props} leftSection={<IconUpload />}>
                Import
              </Button>
            )}
          </FileButton>
        </Group>
      </Group>

      {savedWords.length === 0 ? (
        <Text size="lg" ta="center" mt="xl">
          You haven't saved any words yet.
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {savedWords.map((word: Word) => (
            <Paper
              key={word.id}
              radius="md"
              style={{ cursor: "pointer", height: "200px" }}
            >
              <SpinnerCard word={word} showGender={true} />
            </Paper>
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}

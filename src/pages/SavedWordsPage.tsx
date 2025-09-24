import {
  Container,
  Paper,
  Title,
  Text,
  Group,
  Button,
  SimpleGrid,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import type { Word } from "../App";
import { useWordStore } from "../store/store";
import { SpinnerCard } from "../components/SpinnerCard";

interface SavedWordsPageProps {
  onBack: () => void;
}

export function SavedWordsPage({ onBack }: SavedWordsPageProps) {
  // Use Zustand store for saved words state
  const { savedWords } = useWordStore();

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

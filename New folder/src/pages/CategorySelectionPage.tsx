import {
  Container,
  Grid,
  Paper,
  Title,
  Text,
  Button,
  Group,
} from "@mantine/core";
import type { LearningMode } from "../App";

const categories = [
  { name: "Family", emoji: "👨‍👩‍👧‍👦" },
  { name: "Food", emoji: "🍔" },
  { name: "Travel", emoji: "✈️" },
  { name: "School", emoji: "🏫" },
];

const modeTitles = {
  startLearning: "Start Learning",
  practiceGender: "Practice Gender",
  practiceTyping: "Practice Typing",
};

interface CategorySelectionPageProps {
  onBack: () => void;
  onCategorySelect: (category: string) => void;
  mode: LearningMode | null;
}

export function CategorySelectionPage({
  onBack,
  onCategorySelect,
  mode,
}: CategorySelectionPageProps) {
  const title = mode ? modeTitles[mode] : "Select a Category";

  return (
    <Container size="md" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1}>{title}</Title>
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </Group>

      <Text mb="md">Please select a category to begin:</Text>

      <Grid>
        {categories.map((category) => (
          <Grid.Col span={{ base: 12, sm: 6 }} key={category.name}>
            <Paper
              shadow="md"
              p="xl"
              radius="md"
              withBorder
              style={{ cursor: "pointer", textAlign: "center" }}
              onClick={() => onCategorySelect(category.name.toLowerCase())}
            >
              <Text style={{ fontSize: "3rem" }}>{category.emoji}</Text>
              <Title order={3} mt="md">
                {category.name}
              </Title>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}

import {
  Container,
  Grid,
  Paper,
  Title,
  Text,
  Group,
  Button,
} from "@mantine/core";
import type { LearningMode } from "../App";
import { motion } from "framer-motion";
import { Categories } from "../utils/Categories";
import type { Category } from "../types/DataFileType";
import { IconArrowLeft } from "@tabler/icons-react";

const modeTitles = {
  startLearning: "Start Learning",
  practiceGender: "Practice Gender",
  practiceTyping: "Practice Typing",
  savedWords: "Saved Words",
};

interface CategorySelectionPageProps {
  onBack: () => void;
  onCategorySelect: (category: Category) => void;
  mode: LearningMode | null;
}

export function CategorySelectionPage({
  onBack,
  onCategorySelect,
  mode,
}: CategorySelectionPageProps) {
  const title = mode ? modeTitles[mode] : "Select a Category";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <Container size="md" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1}>{title}</Title>
        <Button
          variant="outline"
          leftSection={<IconArrowLeft />}
          onClick={onBack}
        >
          Back
        </Button>
      </Group>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.2 }}
      >
        <Grid>
          {Categories.map((category: Category) => (
            <Grid.Col span={{ base: 12, sm: 6 }} key={category.name}>
              <motion.div variants={itemVariants}>
                <Paper
                  shadow="md"
                  p="xl"
                  radius="md"
                  withBorder
                  style={{ cursor: "pointer", textAlign: "center" }}
                  onClick={() => onCategorySelect(category)}
                >
                  <Text style={{ fontSize: "3rem" }}>{category.emoji}</Text>
                  <Title order={3} mt="md">
                    {category.name}
                  </Title>
                </Paper>
              </motion.div>
            </Grid.Col>
          ))}
        </Grid>
      </motion.div>
    </Container>
  );
}

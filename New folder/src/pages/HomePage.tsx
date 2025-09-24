import { Container, Grid, Paper, Title, Text, Group } from "@mantine/core";
import type { LearningMode } from "../App";
import { motion } from "framer-motion";

const learningModes = [
  { id: "startLearning", title: "Start Learning", emoji: "📚" },
  { id: "practiceGender", title: "Practice Gender", emoji: "♀️♂️" },
  { id: "practiceTyping", title: "Practice Typing", emoji: "⌨️" },
  { id: "savedWords", title: "Saved Words", emoji: "⭐" },
  { id: "test", title: "Test", emoji: "🏆" },
];

interface HomePageProps {
  onModeSelect: (mode: LearningMode) => void;
}

export function HomePage({ onModeSelect }: HomePageProps) {
  // 2. Define variants for the container and items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // This will animate children one by one
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
        <Title order={1}>Vocabulary Trainer</Title>
      </Group>

      {/* 3. Apply the variants to the Grid and Grid.Col */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid>
          {learningModes.map((mode) => (
            <Grid.Col span={{ base: 12, sm: 6 }} key={mode.id}>
              {/* Note: We need to wrap the Paper in a motion.div to animate it */}
              <motion.div variants={itemVariants}>
                <Paper
                  shadow="md"
                  p="xl"
                  radius="md"
                  withBorder
                  style={{ cursor: "pointer", textAlign: "center" }}
                  onClick={() => {
                    if (
                      [
                        "startLearning",
                        "practiceGender",
                        "practiceTyping",
                      ].includes(mode.id)
                    ) {
                      onModeSelect(mode.id as LearningMode);
                    } else {
                      alert(`${mode.title} is coming soon!`);
                    }
                  }}
                >
                  <Text style={{ fontSize: "3rem" }}>{mode.emoji}</Text>
                  <Title order={3} mt="md">
                    {mode.title}
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

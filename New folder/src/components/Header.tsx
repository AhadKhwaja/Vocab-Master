import {
  Group,
  Title,
  ActionIcon,
  Autocomplete,
} from "@mantine/core";
import {
  IconSun,
  IconMoonStars,
  IconHome2,
  IconSearch,
} from "@tabler/icons-react";
import type { Word } from "../App";

// 1. Re-add theme props to the interface
interface HeaderProps {
  onHomeClick: () => void;
  allWords: Word[];
  onSearchSelect: (word: Word) => void;
  colorScheme: "light" | "dark";
  toggleColorScheme: () => void;
}

export function Header({
  onHomeClick,
  allWords,
  onSearchSelect,
  colorScheme,
  toggleColorScheme,
}: HeaderProps) {
  const searchData = allWords.map((word) => ({
    ...word,
    value: `${word.article ? word.article + " " : ""}${word.german} - ${
      word.english
    }`,
  }));

  return (
    <Group justify="space-between" h="100%" px="md">
      <Group>
        <ActionIcon
          variant="default"
          onClick={onHomeClick}
          size="lg"
          aria-label="Go to home page"
        >
          <IconHome2 size="1.2rem" />
        </ActionIcon>
        <Title order={3}>Vocab Master</Title>
      </Group>

      <Group>
        <Autocomplete
          placeholder="Search words..."
          data={searchData}
          limit={5}
          leftSection={<IconSearch size="1rem" />}
          filter={({ options, search }) => {
            const splittedSearch = search.toLowerCase().trim().split(" ");
            return options.filter((option) => {
              const words = (option as any).value.toLowerCase().trim().split(" ");
              return splittedSearch.every((searchWord) =>
                words.includes(searchWord)
              );
            });
          }}
          onOptionSubmit={(itemValue) => {
            const selectedWord = allWords.find(
              (word) =>
                `${word.article ? word.article + " " : ""}${word.german} - ${
                  word.english
                }` === itemValue
            );
            if (selectedWord) {
              onSearchSelect(selectedWord);
            }
          }}
          style={{ width: 250 }}
        />
        {/* 2. Use the props for the onClick and display logic */}
        <ActionIcon
          variant="default"
          onClick={toggleColorScheme}
          size="lg"
          aria-label="Toggle color scheme"
        >
          {colorScheme === "dark" ? (
            <IconSun size="1.2rem" />
          ) : (
            <IconMoonStars size="1.2rem" />
          )}
        </ActionIcon>
      </Group>
    </Group>
  );
}
import { Group, Title, ActionIcon, Autocomplete } from "@mantine/core";
import {
  IconSun,
  IconMoonStars,
  IconHome2,
  IconSearch,
} from "@tabler/icons-react";
import type { Word } from "../App";
import type {
  ComboboxParsedItem,
  ComboboxParsedItemGroup,
} from "@mantine/core";
import { useWordStore } from "../store/store";

interface HeaderProps {
  onHomeClick: () => void;
  onSearchSelect: (word: Word) => void;
  colorScheme: "light" | "dark";
  toggleColorScheme: () => void;
}

export function Header({
  onHomeClick,
  onSearchSelect,
  colorScheme,
  toggleColorScheme,
}: HeaderProps) {
  const { allWords } = useWordStore();
  const searchData = allWords.map((word) => ({
    value: `${word.article ? word.article + " " : ""}${word.german} - ${
      word.english
    }`,
  }));
  return (
    <Group
      justify="space-between"
      h="100%"
      px="md"
      style={{
        padding: "0.5rem 1rem",
        // background: "#242424",
      }}
    >
      <Group>
        <ActionIcon
          variant="default"
          onClick={onHomeClick}
          size="lg"
          aria-label="Go to home page"
        >
          <IconHome2 size="1.2rem" />
        </ActionIcon>

        <Title order={3}>Vocab Master v.1</Title>
      </Group>

      <Group>
        <Autocomplete
          placeholder="Search words..."
          data={searchData}
          limit={10}
          leftSection={<IconSearch size="1rem" />}
          filter={({ options, search }) => {
            const lowerSearch = search.toLowerCase().trim();
            return options.filter(
              (option: ComboboxParsedItem | ComboboxParsedItemGroup) =>
                "value" in option &&
                option.value.toLowerCase().includes(lowerSearch)
            );
          }}
          onOptionSubmit={(itemValue) => {
            const selectedWord = allWords.find(
              (word) =>
                `${word.article ? word.article + " " : ""}${word.german} - ${
                  word.english
                }` === itemValue
            );
            if (selectedWord) onSearchSelect(selectedWord);
          }}
          style={{ width: 250 }}
        />

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

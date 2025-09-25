import { useState, useEffect } from "react";
import { MantineProvider, AppShell } from "@mantine/core";
import { Header } from "./components/Header";
import { AppRouter } from "./AppRouter";
import type { Category } from "./types/DataFileType";
import { useWordStore } from "./store/store";
export type Page =
  | "home"
  | "categorySelection"
  | "startLearning"
  | "practiceGender"
  | "practiceTyping"
  | "savedWords";
export type LearningMode =
  | "startLearning"
  | "practiceGender"
  | "practiceTyping"
  | "savedWords";

export interface Word {
  id: string;
  german: string;
  article?: "der" | "die" | "das";
  english: string;
  category: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [learningMode, setLearningMode] = useState<LearningMode | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("light");
  const [initialWordId, setInitialWordId] = useState<string | null>(null);
  const { loadAllWords } = useWordStore();

  useEffect(() => {
    loadAllWords();
  }, [loadAllWords]);

  const handleSearchSelect = (word: Word) => {
    setCategory(word.category);
    setInitialWordId(word.id);
    setCurrentPage("startLearning");
  };

  const toggleColorScheme = () =>
    setColorScheme((current) => (current === "dark" ? "light" : "dark"));

  const handleModeSelect = (mode: LearningMode) => {
    setLearningMode(mode);
    if (mode === "savedWords") {
      setCurrentPage("savedWords");
    } else {
      setCurrentPage("categorySelection");
    }
  };

  const handleCategorySelect = (selectedCategory: Category) => {
    setCategory(selectedCategory.fileName);
    if (learningMode === "startLearning") {
      setCurrentPage("startLearning");
    } else if (learningMode === "practiceGender") {
      setCurrentPage("practiceGender");
    } else if (learningMode === "practiceTyping") {
      setCurrentPage("practiceTyping");
    }
  };

  const handleGoBack = () => {
    setInitialWordId(null);
    if (
      ["startLearning", "practiceGender", "practiceTyping"].includes(
        currentPage
      )
    ) {
      setCurrentPage("categorySelection");
    } else if (currentPage === "categorySelection") {
      setCurrentPage("home");
    } else if (currentPage === "savedWords") {
      setCurrentPage("home");
    }
  };

  const handleHomeClick = () => {
    setInitialWordId(null);
    setCurrentPage("home");
  };

  const handleSavedWordSelect = (word: Word) => {
    setCategory(word.category);
    setInitialWordId(word.id);
    setCurrentPage("startLearning");
  };

  const primaryColor = colorScheme === "dark" ? "gray" : "dark";

  return (
    <MantineProvider theme={{ primaryColor }} forceColorScheme={colorScheme}>
      <AppShell padding="md" header={{ height: 60 }}>
        <Header
          toggleColorScheme={toggleColorScheme}
          colorScheme={colorScheme}
          onHomeClick={handleHomeClick}
          onSearchSelect={handleSearchSelect}
        />

        <AppShell.Main>
          <AppRouter
            currentPage={currentPage}
            learningMode={learningMode}
            category={category}
            initialWordId={initialWordId}
            handleModeSelect={handleModeSelect}
            handleCategorySelect={handleCategorySelect}
            handleGoBack={handleGoBack}
            handleSavedWordSelect={handleSavedWordSelect}
          />
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default App;

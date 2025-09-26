import { useEffect, useState } from "react";
import { MantineProvider, AppShell } from "@mantine/core";
import { Header } from "./components/Header";
import { AppRouter } from "./AppRouter";
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
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("light");
  const {
    loadAllWords,
    currentPage,
    learningMode,
    category,
    initialWordId,
    handleModeSelect,
    handleCategorySelect,
    handleGoBack,
    handleHomeClick,
    handleSearchSelect,
    handleSavedWordSelect,
  } = useWordStore();

  useEffect(() => {
    loadAllWords();
  }, [loadAllWords]);

  const toggleColorScheme = () =>
    setColorScheme((current) => (current === "dark" ? "light" : "dark"));

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
            onWordSelect={handleSavedWordSelect}
          />
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default App;

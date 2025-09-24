import { useState, useEffect } from "react";
import { MantineProvider, AppShell } from "@mantine/core";
import { Header } from "./components/Header";
import { HomePage } from "./pages/HomePage";
import { CategorySelectionPage } from "./pages/CategorySelectionPage";
import { StartLearningPage } from "./pages/StartLearningPage";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import { PracticeGenderPage } from "./pages/PracticeGenderPage";
import { PracticeTypingPage } from "./pages/PracticeTypingPage";

export type Page =
  | "home"
  | "categorySelection"
  | "startLearning"
  | "practiceGender"
  | "practiceTyping";
export type LearningMode =
  | "startLearning"
  | "practiceGender"
  | "practiceTyping";

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
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("dark");
  const [allWords, setAllWords] = useState<Word[]>([]);
  const [initialWordId, setInitialWordId] = useState<string | null>(null);

  useEffect(() => {
    const categories = ["family", "food"];
    const loadAllWords = async () => {
      const wordsData = await Promise.all(
        categories.map(async (category) => {
          const module = await import(`./data/${category}.json`);
          // Add the category to each word object
          return module.default.map((word: Omit<Word, "category">) => ({
            ...word,
            category,
          }));
        })
      );
      setAllWords(wordsData.flat());
    };
    loadAllWords();
  }, []);

  const handleSearchSelect = (word: Word) => {
    setCategory(word.category);
    setInitialWordId(word.id); // Set the specific word to jump to
    setCurrentPage("startLearning");
  };

  const toggleColorScheme = () =>
    setColorScheme((current) => (current === "dark" ? "light" : "dark"));

  const handleModeSelect = (mode: LearningMode) => {
    setLearningMode(mode);
    setCurrentPage("categorySelection");
  };

  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory.toLowerCase());
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
    }
  };

  const handleHomeClick = () => {
    setCurrentPage("home");
  };

  const primaryColor = colorScheme === "dark" ? "grape" : "indigo";

  const pageVariants = {
    initial: {
      opacity: 0,
    },
    in: {
      opacity: 1,
    },
    out: {
      opacity: 0,
    },
  };

  const pageTransition: Transition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.4,
  };

  return (
    <MantineProvider theme={{ primaryColor }} forceColorScheme={colorScheme}>
      <AppShell padding="md" header={{ height: 60 }}>
        <AppShell.Header>
          <Header
            toggleColorScheme={toggleColorScheme}
            colorScheme={colorScheme}
            onHomeClick={handleHomeClick}
            allWords={allWords}
            onSearchSelect={handleSearchSelect}
          />
        </AppShell.Header>

        <AppShell.Main>
          <AnimatePresence mode="wait">
            {currentPage === "home" && (
              <motion.div
                key="home"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <HomePage onModeSelect={handleModeSelect} />
              </motion.div>
            )}

            {currentPage === "categorySelection" && (
              <motion.div
                key="categorySelection"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <CategorySelectionPage
                  onBack={handleGoBack}
                  onCategorySelect={handleCategorySelect}
                  mode={learningMode}
                />
              </motion.div>
            )}

            {currentPage === "startLearning" && category && (
              <motion.div
                key="startLearning"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <StartLearningPage
                  category={category}
                  onBack={handleGoBack}
                  initialWordId={initialWordId}
                />
              </motion.div>
            )}
            {currentPage === "practiceGender" && category && (
              <motion.div
                key="practiceGender"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <PracticeGenderPage category={category} onBack={handleGoBack} />
              </motion.div>
            )}
            {currentPage === "practiceTyping" && category && (
              <motion.div
                key="practiceTyping"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <PracticeTypingPage category={category} onBack={handleGoBack} />
              </motion.div>
            )}
          </AnimatePresence>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default App;

import { motion, AnimatePresence, type Transition } from "framer-motion";
import { HomePage } from "./pages/HomePage";
import { CategorySelectionPage } from "./pages/CategorySelectionPage";
import { StartLearningPage } from "./pages/StartLearningPage";
import { PracticeGenderPage } from "./pages/PracticeGenderPage";
import { PracticeTypingPage } from "./pages/PracticeTypingPage";
import { SavedWordsPage } from "./pages/SavedWordsPage";
import type { Page, LearningMode, Word } from "./App";
import type { Category } from "./types/DataFileType";

interface AppRouterProps {
  currentPage: Page;
  learningMode: LearningMode | null;
  category: string | null;
  initialWordId: string | null;
  handleModeSelect: (mode: LearningMode) => void;
  handleCategorySelect: (category: Category) => void;
  handleGoBack: () => void;
  onWordSelect: (word: Word) => void;
}

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
  duration: 0.1,
};

export function AppRouter({
  currentPage,
  learningMode,
  category,
  initialWordId,
  handleModeSelect,
  handleCategorySelect,
  handleGoBack,
  onWordSelect,
}: AppRouterProps) {
  return (
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
      {currentPage === "savedWords" && (
        <motion.div
          key="savedWords"
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          <SavedWordsPage onBack={handleGoBack} onWordSelect={onWordSelect} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Word, Page, LearningMode } from "../App";
import { Categories } from "../utils/Categories";
import type { Category } from "../types/DataFileType";

interface WordState {
  allWords: Word[];
  savedWords: Word[];
  currentPage: Page;
  learningMode: LearningMode | null;
  category: string | null;
  initialWordId: string | null;
  loadAllWords: () => Promise<void>;
  saveWord: (word: Word) => void;
  unsaveWord: (word: Word) => void;
  handleModeSelect: (mode: LearningMode) => void;
  handleCategorySelect: (category: Category) => void;
  handleGoBack: () => void;
  handleHomeClick: () => void;
  handleSearchSelect: (word: Word) => void;
  handleSavedWordSelect: (word: Word) => void;
}

const modules = import.meta.glob("/src/data/*.json");

export const useWordStore = create<WordState>()(
  persist(
    (set, get) => ({
      allWords: [],
      savedWords: [],
      currentPage: "home",
      learningMode: null,
      category: null,
      initialWordId: null,
      loadAllWords: async () => {
        const wordsData = await Promise.all(
          Categories.map(async (category: Category) => {
            try {
              // ensure .json suffix
              const wantedFileName = category.fileName?.endsWith(".json")
                ? category.fileName
                : `${category.fileName}.json`;

              // find module by file name
              const entry = Object.entries(modules).find(([key]) =>
                key.endsWith(wantedFileName)
              );

              if (!entry) {
                console.error(
                  `Module not found for category: ${category.fileName}`,
                  "available modules:",
                  Object.keys(modules)
                );
                return [];
              }

              const importFn = entry[1];
              const module = (await importFn()) as { default: Word[] };

              const categoryId = wantedFileName.replace(/\.json$/, "");

              return module.default.map((word: Omit<Word, "category">) => ({
                ...word,
                category: categoryId,
              }));
            } catch (error) {
              console.error(
                `Failed to load words for category: ${category.fileName}`,
                error
              );
              return [];
            }
          })
        );

        // flatten results
        const merged = wordsData.flat();

        // ✅ deduplicate by word.id
        const unique = Array.from(
          new Map(merged.map((w) => [w.german, w])).values()
        );

        set({ allWords: unique });
      },

      saveWord: (word) =>
        set((state) => {
          if (!state.savedWords.some((w) => w.id === word.id)) {
            return { savedWords: [...state.savedWords, word] };
          }
          return state;
        }),

      unsaveWord: (wordToRemove) =>
        set((state) => ({
          savedWords: state.savedWords.filter((w) => w.id !== wordToRemove.id),
        })),

      handleModeSelect: (mode) => {
        set({ learningMode: mode });
        if (mode === "savedWords") {
          set({ currentPage: "savedWords" });
        } else {
          set({ currentPage: "categorySelection" });
        }
      },

      handleCategorySelect: (selectedCategory) => {
        set({ category: selectedCategory.fileName });
        const { learningMode } = get();
        if (learningMode === "startLearning") {
          set({ currentPage: "startLearning" });
        } else if (learningMode === "practiceGender") {
          set({ currentPage: "practiceGender" });
        } else if (learningMode === "practiceTyping") {
          set({ currentPage: "practiceTyping" });
        }
      },

      handleGoBack: () => {
        set({ initialWordId: null });
        const { currentPage } = get();
        if (
          ["startLearning", "practiceGender", "practiceTyping"].includes(
            currentPage
          )
        ) {
          set({ currentPage: "categorySelection" });
        } else if (["categorySelection", "savedWords"].includes(currentPage)) {
          set({ currentPage: "home" });
        }
      },

      handleHomeClick: () => {
        set({ initialWordId: null, currentPage: "home" });
      },

      handleSearchSelect: (word) => {
        set({
          category: word.category,
          initialWordId: word.id,
          currentPage: "startLearning",
          learningMode: "startLearning",
        });
      },

      handleSavedWordSelect: (word) => {
        get().handleSearchSelect(word); // Reuse the same logic
      },
    }),
    {
      name: "vocab-master-storage",
      partialize: (state) => ({ savedWords: state.savedWords }), // Only persist savedWords
    }
  )
);

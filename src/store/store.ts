import { create } from "zustand";
import type { Word } from "../App";
import { Categories } from "../utils/Categories";
import type { Category } from "../types/DataFileType";

interface WordStore {
  allWords: Word[];
  savedWords: Word[];
  loadAllWords: () => Promise<void>;
  saveWord: (word: Word) => void;
  unsaveWord: (word: Word) => void;
}

const savedWords = JSON.parse(localStorage.getItem("savedWords") || "[]");

// Try several relative-glob patterns (more robust for different file locations)
const modules = {
  ...import.meta.glob("./data/*.json"),
  ...import.meta.glob("../data/*.json"),
  ...import.meta.glob("../../data/*.json"),
} as Record<string, () => Promise<{ default: Word[] }>>;

export const useWordStore = create<WordStore>((set) => ({
  allWords: [],
  savedWords: savedWords,
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
      const isWordSaved = state.savedWords.some(
        (w) => w.german === word.german
      );
      if (!isWordSaved) {
        const newSavedWords = [...state.savedWords, word];
        localStorage.setItem("savedWords", JSON.stringify(newSavedWords));
        return { savedWords: newSavedWords };
      }
      return state;
    }),
  unsaveWord: (word) =>
    set((state) => {
      const newSavedWords = state.savedWords.filter((w) => w.id !== word.id);
      localStorage.setItem("savedWords", JSON.stringify(newSavedWords));
      return { savedWords: newSavedWords };
    }),
}));

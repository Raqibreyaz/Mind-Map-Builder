import { create } from "zustand";

interface CanvasUiState {
  eraserMode: boolean;
  isDarkMode: boolean;
  toggleEraserMode: () => void;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
}

export const useCanvasUiStore = create<CanvasUiState>((set) => {
  // Initialize dark mode from localStorage or system preference
  const getInitialDarkMode = () => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) {
      return saved === "true";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  const initialDarkMode = getInitialDarkMode();

  // Apply initial dark mode
  if (initialDarkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  return {
    eraserMode: false,
    isDarkMode: initialDarkMode,

    toggleEraserMode: () =>
      set((state) => ({ eraserMode: !state.eraserMode })),

    toggleDarkMode: () =>
      set((state) => {
        const newDarkMode = !state.isDarkMode;
        
        // Update DOM
        if (newDarkMode) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        
        // Save to localStorage
        localStorage.setItem("darkMode", String(newDarkMode));
        
        return { isDarkMode: newDarkMode };
      }),

    setDarkMode: (isDark) =>
      set(() => {
        // Update DOM
        if (isDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        
        // Save to localStorage
        localStorage.setItem("darkMode", String(isDark));
        
        return { isDarkMode: isDark };
      }),
  };
});

// Listen for system theme changes
if (typeof window !== "undefined") {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  
  mediaQuery.addEventListener("change", (e) => {
    const hasUserPreference = localStorage.getItem("darkMode") !== null;
    if (!hasUserPreference) {
      useCanvasUiStore.getState().setDarkMode(e.matches);
    }
  });
}
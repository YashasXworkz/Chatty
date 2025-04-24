import { create } from "zustand";

export const useEmotionStore = create((set) => ({
  emotionDetectionEnabled: localStorage.getItem("emotion-detection-enabled") === "true" || true,
  toggleEmotionDetection: () => {
    const currentValue = localStorage.getItem("emotion-detection-enabled") === "true" || true;
    const newValue = !currentValue;
    localStorage.setItem("emotion-detection-enabled", newValue.toString());
    set({ emotionDetectionEnabled: newValue });
  },
}));

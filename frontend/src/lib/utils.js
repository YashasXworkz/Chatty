export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function getEmotionStyles(emotion) {
  // Default styles
  const baseStyles = {
    textColor: "",
    backgroundColor: "",
    animationClass: "",
    fontWeight: "",
    fontSize: "",
  };

  // Apply specific styles based on emotion
  switch (emotion) {
    case "happy":
      baseStyles.textColor = "text-amber-600 dark:text-amber-400";
      baseStyles.backgroundColor = "bg-amber-100 dark:bg-amber-900/30";
      baseStyles.fontWeight = "font-medium";
      break;
    case "sad":
      baseStyles.textColor = "text-blue-600 dark:text-blue-400";
      baseStyles.backgroundColor = "bg-blue-100 dark:bg-blue-900/30";
      baseStyles.fontWeight = "font-normal";
      break;
    case "angry":
      baseStyles.textColor = "text-red-600 dark:text-red-400";
      baseStyles.backgroundColor = "bg-red-100 dark:bg-red-900/30";
      baseStyles.fontWeight = "font-bold";
      break;
    case "excited":
      baseStyles.textColor = "text-green-600 dark:text-green-400";
      baseStyles.backgroundColor = "bg-green-100 dark:bg-green-900/30";
      baseStyles.animationClass = "animate-pulse";
      baseStyles.fontWeight = "font-semibold";
      break;
    case "surprised":
      baseStyles.textColor = "text-purple-600 dark:text-purple-400";
      baseStyles.backgroundColor = "bg-purple-100 dark:bg-purple-900/30";
      baseStyles.animationClass = "animate-bounce";
      baseStyles.fontWeight = "font-medium";
      break;
    default:
      // neutral - keep default styling
      return baseStyles;
  }

  return baseStyles;
}

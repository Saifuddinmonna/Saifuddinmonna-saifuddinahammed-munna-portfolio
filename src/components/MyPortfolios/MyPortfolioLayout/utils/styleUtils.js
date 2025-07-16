import { STYLE_OPTIONS } from "./constants";

// ===== Style variants for different preview modes =====
export const getStyleClasses = style => {
  switch (style) {
    case STYLE_OPTIONS.MODERN:
      return {
        card: "bg-gradient-to-br from-[var(--background-paper)] to-[var(--background-elevated)] border-none shadow-lg hover:shadow-xl",
        title: "text-[var(--primary-main)] dark:text-[var(--primary-light)]",
        category: "text-[var(--secondary-main)] dark:text-[var(--secondary-light)]",
        description: "text-[var(--text-secondary)]",
        button:
          "bg-gradient-to-r from-[var(--primary-main)] to-[var(--secondary-main)] text-white hover:from-[var(--primary-dark)] hover:to-[var(--secondary-dark)]",
      };
    case STYLE_OPTIONS.MINIMAL:
      return {
        card: "bg-[var(--background-paper)] border border-[var(--border-color)] shadow-sm hover:shadow-md",
        title: "text-[var(--text-primary)]",
        category: "text-[var(--text-secondary)]",
        description: "text-[var(--text-secondary)]",
        button:
          "bg-[var(--background-elevated)] text-[var(--text-primary)] hover:bg-[var(--background-paper)]",
      };
    case STYLE_OPTIONS.GRADIENT:
      return {
        card: "bg-gradient-to-r from-[var(--primary-main)]/10 to-[var(--secondary-main)]/10 border border-[var(--border-color)]/50",
        title: "text-[var(--primary-main)] dark:text-[var(--primary-light)]",
        category: "text-[var(--secondary-main)] dark:text-[var(--secondary-light)]",
        description: "text-[var(--text-secondary)]",
        button: "bg-gradient-to-r from-[var(--primary-main)] to-[var(--secondary-main)] text-white",
      };
    case STYLE_OPTIONS.NEUMORPHIC:
      return {
        card: "bg-[var(--background-paper)] shadow-[5px_5px_10px_rgba(0,0,0,0.1),-5px_-5px_10px_rgba(255,255,255,0.1)] border-none",
        title: "text-[var(--text-primary)]",
        category: "text-[var(--text-secondary)]",
        description: "text-[var(--text-secondary)]",
        button: "bg-[var(--background-elevated)] text-[var(--text-primary)] shadow-inner",
      };
    default:
      return {
        card: "bg-[var(--background-paper)] border border-[var(--border-color)]",
        title: "text-[var(--text-primary)]",
        category: "text-[var(--text-secondary)]",
        description: "text-[var(--text-secondary)]",
        button: "bg-[var(--primary-main)] text-white",
      };
  }
};

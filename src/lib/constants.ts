export const LANGUAGES = [
    { id: "javascript", name: "JavaScript", extensions: [".js", ".jsx"] },
    { id: "html", name: "HTML", extensions: [".html"] },
    { id: "css", name: "CSS", extensions: [".css"] },
    { id: "json", name: "JSON", extensions: [".json"] },
    { id: "markdown", name: "Markdown", extensions: [".md"] },
] as const;

export type LanguageId = (typeof LANGUAGES)[number]["id"];

export const DEFAULT_SETTINGS = {
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: false,
};

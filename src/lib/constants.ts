export const LANGUAGES = [
    { id: "javascript", name: "JavaScript", extensions: [".js", ".jsx"] },
    { id: "html", name: "HTML", extensions: [".html"] },
    { id: "css", name: "CSS", extensions: [".css"] },
    { id: "json", name: "JSON", extensions: [".json"] },
    { id: "markdown", name: "Markdown", extensions: [".md"] },
    { id: "sql", name: "SQL", extensions: [".sql"] },
] as const;

export type LanguageId = (typeof LANGUAGES)[number]["id"];

export interface Settings {
    tabWidth: number;
    useTabs: boolean;
    semi: boolean;
    singleQuote: boolean;
    formatOnPaste: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: false,
    formatOnPaste: false,
};

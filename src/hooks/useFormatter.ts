import { useState, useCallback } from "react";
import * as prettier from "prettier/standalone";
import * as parserBabel from "prettier/plugins/babel";
import * as parserHtml from "prettier/plugins/html";
import * as parserPostcss from "prettier/plugins/postcss";
import * as parserMarkdown from "prettier/plugins/markdown";
import * as parserEstree from "prettier/plugins/estree";
import { LanguageId } from "@/lib/constants";

interface FormatOptions {
    tabWidth: number;
    useTabs: boolean;
    semi: boolean;
    singleQuote: boolean;
}

export function useFormatter() {
    const [formattedCode, setFormattedCode] = useState("");
    const [error, setError] = useState<string | null>(null);

    const format = useCallback(
        async (code: string, language: LanguageId, options: FormatOptions) => {
            setError(null);
            if (!code.trim()) {
                setFormattedCode("");
                return;
            }

            try {
                let parser = "babel";
                let plugins = [parserBabel, parserEstree];

                switch (language) {
                    case "javascript":
                        parser = "babel";
                        plugins = [parserBabel, parserEstree];
                        break;
                    case "html":
                        parser = "html";
                        plugins = [parserHtml];
                        break;
                    case "css":
                        parser = "css";
                        plugins = [parserPostcss];
                        break;
                    case "json":
                        parser = "json";
                        plugins = [parserBabel, parserEstree]; // Babel parses JSON too
                        break;
                    case "markdown":
                        parser = "markdown";
                        plugins = [parserMarkdown];
                        break;
                    default:
                        parser = "babel";
                }

                const result = await prettier.format(code, {
                    parser,
                    plugins,
                    ...options,
                });

                setFormattedCode(result);
            } catch (err: any) {
                setError(err.message || "An error occurred during formatting");
                // Keep the previous formatted code or maybe clear it? 
                // Usually better to keep it or just show error.
                console.error("Formatting error:", err);
            }
        },
        []
    );

    return { formattedCode, error, format };
}

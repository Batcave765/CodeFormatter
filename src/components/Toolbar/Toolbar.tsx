import { Play, Copy, Trash2, Settings } from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";
import { LanguageId } from "@/lib/constants";

interface ToolbarProps {
    language: LanguageId;
    onLanguageChange: (lang: LanguageId) => void;
    onFormat: () => void;
    onCopy: () => void;
    onClear: () => void;
    onSettings: () => void;
    showPreview: boolean;
    onPreview: () => void;
}

export function Toolbar({
    language,
    onLanguageChange,
    onFormat,
    onCopy,
    onClear,
    onSettings,
    showPreview,
    onPreview,
}: ToolbarProps) {
    return (
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
            <div className="flex items-center gap-4">
                <LanguageSelector value={language} onChange={onLanguageChange} />

                <div className="h-6 w-px bg-border mx-2" />

                <button
                    onClick={onFormat}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground text-sm font-medium rounded-md hover:bg-accent/90 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                >
                    <Play className="w-4 h-4" />
                    Format
                </button>

                {language === "markdown" && (
                    <button
                        onClick={onPreview}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors border border-border ${showPreview ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                    >
                        {showPreview ? "Edit / Code" : "Preview"}
                    </button>
                )}
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onCopy}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    title="Copy to Clipboard"
                >
                    <Copy className="w-4 h-4" />
                </button>
                <button
                    onClick={onClear}
                    className="p-2 text-muted-foreground hover:text-red-500 hover:bg-muted rounded-md transition-colors"
                    title="Clear Editor"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
                <div className="h-6 w-px bg-border mx-2" />
                <button
                    onClick={onSettings}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    title="Settings"
                >
                    <Settings className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

import { Play, Copy, Trash2, Settings, GitCompare, FileCode2 } from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";
import { LanguageId, Mode } from "@/lib/constants";

interface ToolbarProps {
    language: LanguageId;
    onLanguageChange: (lang: LanguageId) => void;
    mode: Mode;
    onModeChange: (mode: Mode) => void;
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
    mode,
    onModeChange,
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
                <div className="flex items-center bg-background rounded-md border border-input p-1">
                    <button
                        onClick={() => onModeChange("format")}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-sm transition-all ${mode === "format" ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        <FileCode2 className="w-3.5 h-3.5" />
                        Format
                    </button>
                    <button
                        onClick={() => onModeChange("compare")}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-sm transition-all ${mode === "compare" ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        <GitCompare className="w-3.5 h-3.5" />
                        Compare
                    </button>
                </div>

                <div className="h-6 w-px bg-border mx-2" />

                <LanguageSelector value={language} onChange={onLanguageChange} />

                {mode === "format" && (
                    <>
                        <div className="h-6 w-px bg-border mx-2" />
                        <button
                            onClick={onFormat}
                            className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground text-sm font-medium rounded-md hover:bg-accent/90 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                        >
                            <Play className="w-4 h-4" />
                            Format
                        </button>
                    </>
                )}

                {mode === "format" && language === "markdown" && (
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

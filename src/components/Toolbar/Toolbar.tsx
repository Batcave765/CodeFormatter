import { Play, Copy, Trash2, Settings, GitCompare, FileCode2, Menu, X } from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";
import { LanguageId, Mode } from "@/lib/constants";
import { useState } from "react";

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
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-border bg-muted/30 relative z-20">
            {/* Main Toolbar Content */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4 flex-1">
                    {/* Desktop Mode Toggle */}
                    <div className="hidden md:flex items-center bg-background rounded-md border border-input p-1">
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

                    <div className="hidden md:block h-6 w-px bg-border mx-2" />

                    {/* Language Selector - Always Visible (mostly) */}
                    <div className="flex-1 md:flex-none">
                        <LanguageSelector value={language} onChange={onLanguageChange} />
                    </div>

                    {/* Desktop Format Button */}
                    {mode === "format" && (
                        <>
                            <div className="hidden md:block h-6 w-px bg-border mx-2" />
                            <button
                                onClick={onFormat}
                                className="hidden md:flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground text-sm font-medium rounded-md hover:bg-accent/90 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                            >
                                <Play className="w-4 h-4" />
                                Format
                            </button>
                            {/* Mobile Format Icon Button */}
                            <button
                                onClick={onFormat}
                                className="md:hidden p-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90"
                            >
                                <Play className="w-4 h-4" />
                            </button>
                        </>
                    )}

                    {/* Preview Button - Only for Markdown */}
                    {mode === "format" && language === "markdown" && (
                        <button
                            onClick={onPreview}
                            className={`hidden md:block px-3 py-1.5 text-xs font-medium rounded-md transition-colors border border-border ${showPreview ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                        >
                            {showPreview ? "Edit / Code" : "Preview"}
                        </button>
                    )}
                </div>

                {/* Right Actions */}
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

                    <div className="hidden md:block h-6 w-px bg-border mx-2" />

                    {/* Desktop Settings */}
                    <button
                        onClick={onSettings}
                        className="hidden md:block p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                        title="Settings"
                    >
                        <Settings className="w-4 h-4" />
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors border border-border ml-2"
                    >
                        {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Content */}
            {isOpen && (
                <div className="md:hidden border-t border-border bg-background p-4 space-y-4 shadow-lg absolute w-full top-full left-0 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground uppercase">Mode</label>
                        <div className="flex items-center bg-muted/50 rounded-md border border-input p-1">
                            <button
                                onClick={() => { onModeChange("format"); setIsOpen(false); }}
                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-sm transition-all ${mode === "format" ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                <FileCode2 className="w-4 h-4" />
                                Format
                            </button>
                            <button
                                onClick={() => { onModeChange("compare"); setIsOpen(false); }}
                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-sm transition-all ${mode === "compare" ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                <GitCompare className="w-4 h-4" />
                                Compare
                            </button>
                        </div>
                    </div>

                    {mode === "format" && language === "markdown" && (
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground uppercase">View</label>
                            <button
                                onClick={() => { onPreview(); setIsOpen(false); }}
                                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors border border-border ${showPreview ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-muted"}`}
                            >
                                {showPreview ? "Switch to Code" : "Switch to Preview"}
                            </button>
                        </div>
                    )}

                    <div className="pt-2 border-t border-border">
                        <button
                            onClick={() => { onSettings(); setIsOpen(false); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                        >
                            <Settings className="w-4 h-4" />
                            Settings
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

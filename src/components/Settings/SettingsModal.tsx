import { X } from "lucide-react";
import { DEFAULT_SETTINGS } from "@/lib/constants";

interface Settings {
    tabWidth: number;
    useTabs: boolean;
    semi: boolean;
    singleQuote: boolean;
}

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: Settings;
    onSettingsChange: (settings: Settings) => void;
}

export function SettingsModal({
    isOpen,
    onClose,
    settings,
    onSettingsChange,
}: SettingsModalProps) {
    if (!isOpen) return null;

    const handleChange = (key: keyof Settings, value: any) => {
        onSettingsChange({ ...settings, [key]: value });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-background border border-border rounded-lg shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-lg font-semibold">Formatter Settings</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border-none"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Indentation */}
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Tab Width</label>
                        <select
                            value={settings.tabWidth}
                            onChange={(e) =>
                                handleChange("tabWidth", parseInt(e.target.value))
                            }
                            className="px-3 py-1.5 rounded-md bg-muted border border-border text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                        >
                            <option value={2}>2 Spaces</option>
                            <option value={4}>4 Spaces</option>
                            {/* <option value={8}>8 Spaces</option> */}
                        </select>
                    </div>

                    {/* Use Tabs */}
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Indent Style</label>
                        <div className="flex items-center border border-border rounded-md overflow-hidden bg-muted">
                            <button
                                onClick={() => handleChange("useTabs", false)}
                                className={`px-3 py-1.5 text-xs font-medium transition-colors ${!settings.useTabs ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                Spaces
                            </button>
                            <button
                                onClick={() => handleChange("useTabs", true)}
                                className={`px-3 py-1.5 text-xs font-medium transition-colors ${settings.useTabs ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                Tabs
                            </button>
                        </div>
                    </div>

                    {/* Semicolons */}
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Semicolons</label>
                        <button
                            onClick={() => handleChange("semi", !settings.semi)}
                            className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent ${settings.semi ? "bg-accent" : "bg-muted"}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.semi ? "left-6" : "left-1"}`} />
                        </button>
                    </div>

                    {/* Quotes */}
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Quote Style</label>
                        <div className="flex items-center border border-border rounded-md overflow-hidden bg-muted">
                            <button
                                onClick={() => handleChange("singleQuote", false)}
                                className={`px-3 py-1.5 text-xs font-medium transition-colors ${!settings.singleQuote ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                Double (")
                            </button>
                            <button
                                onClick={() => handleChange("singleQuote", true)}
                                className={`px-3 py-1.5 text-xs font-medium transition-colors ${settings.singleQuote ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                Single (')
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end p-4 border-t border-border bg-muted/20 rounded-b-lg">
                    <button
                        onClick={() => onSettingsChange(DEFAULT_SETTINGS as Settings)}
                        className="text-xs text-muted-foreground hover:text-accent underline mr-auto"
                    >
                        Reset implementation to defaults
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-background border border-border text-foreground hover:bg-muted rounded-md text-sm font-medium transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}

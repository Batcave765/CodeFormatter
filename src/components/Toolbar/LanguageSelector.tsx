import { LANGUAGES, LanguageId } from "@/lib/constants";
import { ChevronDown } from "lucide-react";

interface LanguageSelectorProps {
    value: LanguageId;
    onChange: (value: LanguageId) => void;
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
    return (
        <div className="relative w-full md:w-auto">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value as LanguageId)}
                className="appearance-none h-9 w-full md:w-40 bg-muted text-sm px-3 pr-8 py-1 rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
            >
                {LANGUAGES.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                        {lang.name}
                    </option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
    );
}

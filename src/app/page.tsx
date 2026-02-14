"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { Toolbar } from "@/components/Toolbar/Toolbar";
import { DualPaneEditor } from "@/components/Editor/DualPaneEditor";
import { SettingsModal } from "@/components/Settings/SettingsModal";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFormatter } from "@/hooks/useFormatter";
import { DEFAULT_SETTINGS, LanguageId } from "@/lib/constants";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  // Persisted State
  const [language, setLanguage] = useLocalStorage<LanguageId>("formatter-language", "javascript");
  const [code, setCode] = useLocalStorage<string>("formatter-code", "// Paste your code here\n");
  const [settings, setSettings] = useLocalStorage("formatter-settings", DEFAULT_SETTINGS);

  // Formatter Hook
  const { formattedCode, error, format } = useFormatter();

  // Local State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);

  // Format on language change or explicit action
  // Actually, we usually don't auto-format on language change unless code is already there.
  // But we should update the formatted code if the user wants "live" formatting?
  // Requirement says "Format button", so we stick to that for "beautification".
  // "Live Validation" is handled by Monaco.

  const handleFormat = () => {
    format(code, language, settings);
  };

  const handleCopy = () => {
    if (formattedCode) {
      navigator.clipboard.writeText(formattedCode);
      // Could add toast notification here
    }
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear the editor?")) {
      setCode("");
    }
  };

  if (!mounted) {
    return null; // or a loader
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />

      <Toolbar
        language={language}
        onLanguageChange={setLanguage}
        onFormat={handleFormat}
        onCopy={handleCopy}
        onClear={handleClear}
        onSettings={() => setIsSettingsOpen(true)}
      />

      <main className="flex-1 overflow-hidden relative">
        <DualPaneEditor
          language={language}
          code={code}
          formattedCode={formattedCode}
          onChange={(val) => setCode(val || "")}
          options={{
            tabSize: settings.tabWidth,
            insertSpaces: !settings.useTabs,
          }}
          error={error}
        />
      </main>

      <Footer />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </div>
  );
}

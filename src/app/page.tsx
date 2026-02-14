"use client";

import { useEffect, useState, useCallback } from "react";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { Toolbar } from "@/components/Toolbar/Toolbar";
import { DualPaneEditor } from "@/components/Editor/DualPaneEditor";
import { SettingsModal } from "@/components/Settings/SettingsModal";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFormatter } from "@/hooks/useFormatter";
import { DEFAULT_SETTINGS, LanguageId } from "@/lib/constants";
import { useDropzone } from "react-dropzone";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  // Persisted State
  const [language, setLanguage] = useLocalStorage<LanguageId>("formatter-language", "javascript");
  const [code, setCode] = useLocalStorage<string>("formatter-code", "// Paste your code here\n");
  const [settings, setSettings] = useLocalStorage("formatter-settings", { ...DEFAULT_SETTINGS, formatOnPaste: false });

  // Formatter Hook
  const { formattedCode, error, format } = useFormatter();

  // Local State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFormat = useCallback(() => {
    format(code, language, settings);
  }, [code, language, settings, format]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        handleFormat();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleFormat]);

  const handleCopy = () => {
    if (formattedCode) {
      navigator.clipboard.writeText(formattedCode);
    }
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear the editor?")) {
      setCode("");
    }
  };

  // Drag & Drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCode(content);
        // Auto-detect language extension
        if (file.name.endsWith(".json")) setLanguage("json");
        else if (file.name.endsWith(".html")) setLanguage("html");
        else if (file.name.endsWith(".css")) setLanguage("css");
        else if (file.name.endsWith(".js") || file.name.endsWith(".jsx") || file.name.endsWith(".ts") || file.name.endsWith(".tsx")) setLanguage("javascript");
        else if (file.name.endsWith(".md")) setLanguage("markdown");
        else if (file.name.endsWith(".sql")) setLanguage("sql");
      };
      reader.readAsText(file);
    }
  }, [setCode, setLanguage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true, // Don't trigger file dialog on click, only drag
    noKeyboard: true
  });


  if (!mounted) {
    return null; // or a loader
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground" {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive && (
        <div className="absolute inset-0 z-50 bg-accent/20 backdrop-blur-sm flex items-center justify-center border-4 border-dashed border-accent">
          <div className="text-2xl font-bold text-accent">Drop file to load content</div>
        </div>
      )}

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
          // We need to implement onPaste in DualPaneEditor to trigger this.
          onPaste={() => {
            if (settings.formatOnPaste) {
              setTimeout(handleFormat, 100);
            }
          }}
          onFormat={handleFormat}
        />
      </main>

      {/* <Footer /> */}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </div>
  );
}

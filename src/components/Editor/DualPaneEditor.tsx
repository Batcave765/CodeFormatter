import Editor, { OnMount } from "@monaco-editor/react";
import { LanguageId } from "@/lib/constants";
import { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface DualPaneEditorProps {
    language: LanguageId;
    code: string;
    formattedCode: string;
    onChange: (value: string | undefined) => void;
    options: any; // Monaco options
    error: string | null;
    onPaste?: () => void;
    onFormat?: () => void;
    showPreview?: boolean;
}

export function DualPaneEditor({
    language,
    code,
    formattedCode,
    onChange,
    options,
    error,
    onPaste,
    onFormat,
    showPreview,
}: DualPaneEditorProps) {
    const editorRef = useRef<any>(null);

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;

        // Configure diagnostics (ESLint-like checks)
        monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: false,
            noSyntaxValidation: false,
            diagnosticCodesToIgnore: [], // Can add codes here to ignore
        });

        // Ensure compiler options are strict enough to show "unused" warnings etc if possible?
        // Default Monaco TS/JS setup usually shows unused variables as grayed out or warnings.
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            allowNonTsExtensions: true,
            target: monaco.languages.typescript.ScriptTarget.ESNext,
            noUnusedLocals: true, // Show unused locals
            noUnusedParameters: true, // Show unused params
        });

        editor.onDidPaste(() => {
            if (onPaste) onPaste();
        });

        // Add Command for Ctrl+Enter
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
            if (onFormat) {
                onFormat();
            }
        });
    };

    // Map our language IDs to Monaco language IDs
    const getMonacoLanguage = (lang: LanguageId) => {
        switch (lang) {
            case "javascript": return "javascript";
            case "html": return "html";
            case "css": return "css";
            case "json": return "json";
            case "markdown": return "markdown";
            case "sql": return "sql";
            default: return "plaintext";
        }
    };

    const monacoLanguage = getMonacoLanguage(language);

    const commonOptions = {
        theme: "vs-dark",
        minimap: { enabled: false },
        fontSize: 14,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        padding: { top: 16, bottom: 16 },
        fontFamily: "var(--font-geist-mono), monospace",
        ...options,
    };

    return (
        <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden relative">
            {/* Input Pane */}
            <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-border h-1/2 md:h-full relative group">
                <div className="absolute top-0 right-0 z-10 px-2 py-1 text-xs text-muted-foreground bg-muted/50 rounded-bl-md backdrop-blur-sm pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity">
                    Input
                </div>
                <Editor
                    height="100%"
                    theme="vs-dark"
                    language={monacoLanguage}
                    value={code}
                    onChange={onChange}
                    onMount={handleEditorDidMount}
                    options={commonOptions}
                />
            </div>

            {/* Output Pane */}
            <div className={`flex-1 flex flex-col h-1/2 md:h-full relative group ${error ? "bg-red-950/10" : "bg-background/50"}`}>
                <div className="absolute top-0 right-0 z-10 px-2 py-1 text-xs text-muted-foreground bg-muted/50 rounded-bl-md backdrop-blur-sm pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity">
                    {error ? "Error Log" : showPreview ? "Preview" : "Output"}
                </div>

                {showPreview && language === "markdown" && !error ? (
                    <div className="h-full w-full overflow-auto p-4 prose prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {formattedCode || code}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <Editor
                        height="100%"
                        theme="vs-dark"
                        language={error ? "plaintext" : monacoLanguage}
                        value={error || formattedCode}
                        options={{
                            ...commonOptions,
                            readOnly: true,
                            domReadOnly: true,
                            wordWrap: "on",
                        }}
                    />
                )}
            </div>
        </div>
    );
}

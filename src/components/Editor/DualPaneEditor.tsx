import Editor, { DiffEditor, OnMount, DiffOnMount, useMonaco } from "@monaco-editor/react";
import { LanguageId, Mode } from "@/lib/constants";
import { useRef, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface DualPaneEditorProps {
    language: LanguageId;
    code: string;
    formattedCode: string;
    onChange: (value: string | undefined) => void;
    // New props for Compare mode
    mode?: Mode;
    secondaryCode?: string;
    onSecondaryChange?: (value: string | undefined) => void;

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
    mode = "format",
    secondaryCode = "",
    onSecondaryChange,
    options,
    error,
    onPaste,
    onFormat,
    showPreview,
}: DualPaneEditorProps) {

    const editorRef = useRef<any>(null);
    const diffEditorRef = useRef<any>(null);
    const monaco = useMonaco();

    // Ref to track if the update originated from the editor itself
    const isEditorChange = useRef(false);

    // Ref to track manually created models for proper disposal
    const manualModelsRef = useRef<{ original: any, modified: any } | null>(null);

    // Cleanup models on unmount
    useEffect(() => {
        return () => {
            if (manualModelsRef.current) {
                manualModelsRef.current.original.dispose();
                manualModelsRef.current.modified.dispose();
                manualModelsRef.current = null;
            }
        };
    }, []);

    // Disable linting in compare mode
    useEffect(() => {
        if (monaco) {
            const isCompare = mode === "compare";
            const m = monaco as any;

            // JavaScript & TypeScript
            m.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                noSemanticValidation: isCompare,
                noSyntaxValidation: isCompare,
            });
            m.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
                noSemanticValidation: isCompare,
                noSyntaxValidation: isCompare,
            });

            // JSON
            m.languages.json.jsonDefaults.setDiagnosticsOptions({
                validate: !isCompare
            });

            // HTML
            m.languages.html.htmlDefaults.setOptions({
                validate: !isCompare,
                format: {
                    tabSize: 4,
                    insertSpaces: true,
                    wrapLineLength: 120,
                    unformatted: 'default',
                    contentUnformatted: 'pre,code,textarea',
                    indentInnerHtml: false,
                    preserveNewLines: true,
                    maxPreserveNewLines: null,
                    indentHandlebars: false,
                    endWithNewline: false,
                    extraLiners: 'head, body, /html',
                    wrapAttributes: 'auto'
                }
            });

            // CSS
            m.languages.css.cssDefaults.setOptions({
                validate: !isCompare
            });
        }
    }, [monaco, mode]);

    // Snapshot state to prevent re-renders on every keystroke passed to DiffEditor
    const [codeSnapshot, setCodeSnapshot] = useState(code);
    const [secondaryCodeSnapshot, setSecondaryCodeSnapshot] = useState(secondaryCode);

    // Update snapshots when language or mode changes
    useEffect(() => {
        setCodeSnapshot(code);
        setSecondaryCodeSnapshot(secondaryCode);
    }, [language, mode]);

    // Clear diffEditorRef when not in compare mode to avoid stale reference errors
    useEffect(() => {
        if (mode !== "compare") {
            diffEditorRef.current = null;
        }
    }, [mode]);

    // Check for external updates (e.g. drag & drop, clear) and manually sync models
    useEffect(() => {
        if (mode === "compare" && diffEditorRef.current) {
            // If this update was triggered by the editor itself, reset the flag and do nothing
            if (isEditorChange.current) {
                isEditorChange.current = false;
                return;
            }

            const modifiedModel = diffEditorRef.current.getModifiedEditor().getModel();
            const originalModel = diffEditorRef.current.getOriginalEditor().getModel();

            if (modifiedModel && modifiedModel.getValue() !== code) {
                modifiedModel.setValue(code);
            }

            if (originalModel && originalModel.getValue() !== secondaryCode) {
                originalModel.setValue(secondaryCode);
            }
        }
    }, [code, secondaryCode, mode]);

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;

        // Configure diagnostics (ESLint-like checks)
        monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: false,
            noSyntaxValidation: false,
            diagnosticCodesToIgnore: [], // Can add codes here to ignore
        });

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

    const handleDiffEditorDidMount: DiffOnMount = (editor, monaco) => {
        diffEditorRef.current = editor;

        // Manually create models to control lifecycle and prevent disposal errors
        // Dispose previous models if any
        if (manualModelsRef.current) {
            manualModelsRef.current.original.dispose();
            manualModelsRef.current.modified.dispose();
        }

        const originalModel = monaco.editor.createModel(secondaryCodeSnapshot, monacoLanguage);
        const modifiedModel = monaco.editor.createModel(codeSnapshot, monacoLanguage);

        manualModelsRef.current = { original: originalModel, modified: modifiedModel };
        editor.setModel({ original: originalModel, modified: modifiedModel });

        // Attach listeners
        originalModel.onDidChangeContent(() => {
            if (onSecondaryChange) {
                isEditorChange.current = true;
                onSecondaryChange(originalModel.getValue());
            }
        });

        modifiedModel.onDidChangeContent(() => {
            isEditorChange.current = true;
            onChange(modifiedModel.getValue());
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
            case "xml": return "xml";
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

    if (mode === "compare") {
        return (
            <div className="h-full w-full">
                <DiffEditor

                    height="100%"
                    theme="vs-dark"
                    language={monacoLanguage}
                    onMount={handleDiffEditorDidMount}
                    options={{
                        ...commonOptions,
                        originalEditable: true, // Allow editing the left side
                        diffWordWrap: "off",
                    }}
                />
            </div>
        );
    }

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

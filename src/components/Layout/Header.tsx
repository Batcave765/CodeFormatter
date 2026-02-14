import { Code2 } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
      <div className="flex items-center gap-2">
        <Code2 className="w-6 h-6 text-accent" />
        <h1 className="text-xl font-bold tracking-tight">CodeFormatter</h1>
      </div>
      <div className="hidden md:block text-sm text-muted-foreground">
        Multi-Language Formatter
      </div>
    </header>
  );
}

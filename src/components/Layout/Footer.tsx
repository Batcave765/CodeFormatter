export function Footer() {
    return (
        <footer className="py-4 text-center text-sm text-muted-foreground border-t border-border bg-background">
            <p>&copy; {new Date().getFullYear()} CodeFormatter. All rights reserved.</p>
        </footer>
    );
}

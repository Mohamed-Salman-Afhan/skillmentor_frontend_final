export default function Footer() {
    return (
        <footer className="border-t">
            <div className="container mx-auto py-6 text-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Skillmentor. All Rights Reserved.</p>
            </div>
        </footer>
    );
}
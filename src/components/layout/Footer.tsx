"use client";

export function Footer() {
  return (
    <footer className="border-t py-8 mt-16">
      <div className="container mx-auto px-4 text-center">
        <p className="text-muted-foreground text-sm">
          Built with ❤️ by{" "}
          <a
            href="https://github.com/owinogabriel"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            owinogabriel
          </a>{" "}
          • Made with Next.js & Tailwind CSS
        </p>
      </div>
    </footer>
  );
}

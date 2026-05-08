export default function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Ankit Kumar. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/kumarankit0411"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/kumarankit0411/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="mailto:ankitsingh095@outlook.com"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

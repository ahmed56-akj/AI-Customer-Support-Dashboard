import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SupportAI — AI Customer Support Platform",
  description:
    "Enterprise-grade customer support platform with AI-assisted replies, ticketing, analytics, and customer 360 intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const storedTheme = localStorage.getItem('supportai_theme');
                if (storedTheme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else if (storedTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-400">
        {children}
      </body>
    </html>
  );
}

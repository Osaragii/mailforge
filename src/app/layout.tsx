import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MailForge — AI Cold Email Writer",
  description: "Write cold emails that actually get replies, powered by AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bg text-white min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
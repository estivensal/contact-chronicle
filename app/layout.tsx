import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ContactChronicle",
  description: "Your personal contact history and timeline",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

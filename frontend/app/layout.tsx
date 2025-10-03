import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Test Case",
  description: "Test Case",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

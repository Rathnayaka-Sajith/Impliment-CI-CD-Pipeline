import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Verdanza | 3-Tier Project & Task Workspace",
  description:
    "A clean White & Green 3-Tier Next.js + Prisma + SQLite application for practicing full-stack architecture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased min-h-screen bg-[#f8faf9] text-slate-900`}>
        {children}
      </body>
    </html>
  );
}

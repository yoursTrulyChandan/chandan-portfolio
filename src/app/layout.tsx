import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chandan Nayak — Frontend Developer",
  description:
    "Frontend Developer with 4+ years of experience building high-performance React & Next.js applications. Currently Frontend Lead at Molecule Ventures.",
  keywords: ["Frontend Developer", "React", "Next.js", "TypeScript", "Chandan Nayak"],
  authors: [{ name: "Chandan Nayak" }],
  openGraph: {
    title: "Chandan Nayak — Frontend Developer",
    description: "4+ years crafting pixel-perfect, performant web apps in React & Next.js.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}

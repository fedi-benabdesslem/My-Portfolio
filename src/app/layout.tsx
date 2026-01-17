import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
// FONTS
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  // Weight options
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});
// METADATA
export const metadata: Metadata = {
  title: "FBA-portfolio",
  description:
    "Computer Science Engineering student specializing in systems programming, container security, and modern web development. Bridging mathematical theory with practical engineering.",
  keywords: [
    "Software Engineer",
    "Computer Science",
    "eBPF",
    "Container Security",
    "React",
    "TypeScript",
    "Linux",
  ],
  authors: [{ name: "Fedi Ben Abdesslem" }],
  openGraph: {
    title: "FBA-portfolio",
    description:
      "Computer Science Engineering student specializing in systems programming and modern web development.",
    type: "website",
  },
};
// ROOT LAYOUT
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}
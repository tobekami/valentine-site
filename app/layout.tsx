import type { Metadata } from "next";
import { Bodoni_Moda, Great_Vibes, Permanent_Marker } from "next/font/google";
import "./globals.css";


const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
  display: "swap",
});

const permanentMarker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-permanent-marker",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Will You Be My Valentine?",
  description: "A special question for Enny 💗",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={`${bodoniModa.variable} ${greatVibes.variable} ${permanentMarker.variable}`}
    >
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
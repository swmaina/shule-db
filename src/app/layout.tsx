import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "@/styles/globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Elimu Finder — Schools for Neurodivergent Learners in Kenya",
    template: "%s | Elimu Finder",
  },
  description:
    "Find special schools, integrated units, and inclusive mainstream schools for neurodivergent learners across Kenya. Search by county, condition, and level.",
  keywords: [
    "special needs schools Kenya",
    "autism schools Nairobi",
    "inclusive schools Kenya",
    "ADHD school Kenya",
    "SNE schools",
    "neurodivergent Kenya",
    "integrated unit Kenya",
  ],
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Elimu Finder",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${dmSans.variable}`}>
      <body className="font-body bg-stone-50 text-stone-900 antialiased">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}

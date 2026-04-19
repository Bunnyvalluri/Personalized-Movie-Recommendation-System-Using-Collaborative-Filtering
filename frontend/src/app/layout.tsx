import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: '--font-outfit',
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

export const viewport: Viewport = {
  themeColor: '#e50914',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "CINEPHILE AI | Professional Prediction Engine",
  description: "Experience the next level of cinematic discovery with our high-fidelity hybrid recommendation terminal.",
  icons: {
    icon: "/favicon.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body className="bg-[#050505] text-white selection:bg-[#e50914] selection:text-white">
        <Toaster richColors position="bottom-right" theme="dark" closeButton />
        {children}
      </body>
    </html>
  );
}

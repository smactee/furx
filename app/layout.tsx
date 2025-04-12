// app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Home, MessageCircle, Plus, Search, User } from "lucide-react";
import Link from "next/link";


const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "Für X",
  description: "Peer-to-peer currency exchange app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-gradient-to-b from-[#584175] to-[#422F53] text-white min-h-screen">
        <main className="pb-24">{children}</main>

        {/* Global Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 w-full bg-white/10 p-4 flex justify-around backdrop-blur-lg border-t border-white/20">
  <Link href="/">
    <Home className="text-white" />
  </Link>
  <Link href="/chats">
    <MessageCircle className="text-white" />
  </Link>
  <Link href="/post">
    <div className="bg-purple-500 p-4 rounded-full -mt-8 shadow-lg">
      <Plus className="text-white" />
    </div>
  </Link>
  <Link href="/search">
    <Search className="text-white" />
  </Link>
  <Link href="/profile">
    <User className="text-white" />
  </Link>
</nav>

      </body>
    </html>
  );
}

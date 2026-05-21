// app/layout.tsx
import type { Metadata } from "next";
import Header from "./components/Header"; 
import "./globals.css";

export const metadata: Metadata = {
  title: "Autoteile26",
  description: "Dein Online-Shop für Autoteile",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        
        {/* Header-Baustein */}
        <Header /> 

        <main className="flex-1">
          {children}
        </main>

      </body>
    </html>
  );
}
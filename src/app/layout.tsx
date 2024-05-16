import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/toaster";
import NextAuthSessionProvider from "@/components/session-provider";

import { Inter_Tight as FontSans } from "next/font/google";
import { Red_Hat_Mono as FontMono } from "next/font/google";
import { Roboto_Serif as FontSerif } from "next/font/google";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
});
const fontMono = FontMono({
    subsets: ["latin"],
    variable: "--font-mono",
});
const fontSerif = FontSerif({
    subsets: ["latin"],
    variable: "--font-serif",
});

// cloudflare pages deployment
export const runtime = "edge";
export const dynamic = "force-static";

export const metadata: Metadata = {
    title: "calendar",
    description: "manbug's calendar",
};

export default function RootLayout({
    children,
}: Readonly<{
        children: React.ReactNode;
    }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={cn(
                    "min-h-screen font-sans text-[0.875em] antialiased",
                    fontSans.variable,
                    fontMono.variable,
                    fontSerif.variable,
                )}
                suppressHydrationWarning
            >
                <NextTopLoader color="#000" shadow="none" showAtBottom />
                <Toaster />
                <NextAuthSessionProvider>
                    {children}
                </NextAuthSessionProvider>
            </body>
        </html>
    );
}

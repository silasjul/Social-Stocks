import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/sidebar/theme-provider";
import PeopleProvider from "@/contexts/people-context";

const geist = Geist({
    variable: "--font-geist",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "TradeSocial",
    description: "A trading signal platform based on social media sentiment",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geist.variable} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <PeopleProvider>{children}</PeopleProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}

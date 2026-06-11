import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/common/Header";
import { SidebarLayout } from "@/components/common/SidebarLayout";
import { CustomTabs } from "@/components/common/CustomTabs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "dev活ブログ",
  description:
    "RyoK73のパーソナル技術ブログ 開発記録や個人的な技術に対する思いを綴ります。",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full grid-bg-light dark:grid-bg-dark`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
          storage="local"
        >
          <div className="max-w-6xl mx-auto w-full flex flex-col gap-5 p-5">
            <Header />
            <div className="flex lg:gap-5">
              <SidebarLayout />
              <main className="w-full">{children}</main>
            </div>
            <CustomTabs
              navClassName="fixed inset-x-0 border border-border bg-background/90 bottom-2 w-full h-10 justify-evenly lg:hidden"
              linkClassName="item-center w-full"
            />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

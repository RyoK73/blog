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
  verification: {
    google: "gxHSw769zX3RHs7sWzh4rL_8MW-qggse_EAPvbDqN70",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} grid-bg-light dark:grid-bg-dark w-full antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
          storage="local"
        >
          {/* 上padding 20px(p-5) + Header Height 100px(h-25) + gap 20px(gap-5) を考慮してSidebarLayoutにtop-35を指定している */}
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 p-5">
            <Header className="h-25 sticky top-5 z-50" />
            <div className="flex lg:gap-5">
              <SidebarLayout className="top-35" />
              <main className="min-w-0 flex-1">{children}</main>
            </div>
            <CustomTabs
              navClassName="fixed inset-x-0 z-50 border border-border bg-background bottom-2 w-full h-10 justify-evenly lg:hidden"
              linkClassName="item-center w-full"
            />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

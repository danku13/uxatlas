import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UX Patterns — Mobile UX Drop-off Atlas",
  description:
    "Каталог мобильных UX-паттернов для продукт-менеджеров и UX-дизайнеров. Паттерны сгруппированы по точкам оттока пользователей: онбординг, авторизация, поиск, формы, оплата, ошибки, empty states, загрузка, уведомления и настройки.",
  keywords: [
    "UX patterns",
    "mobile UX",
    "drop-off",
    "retention",
    "product design",
    "Material Design",
    "HIG",
    "Nielsen",
    "UX atlas",
  ],
  authors: [{ name: "UX Patterns Atlas Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "UX Patterns — Mobile UX Drop-off Atlas",
    description:
      "Mobile UX patterns catalog organized by user drop-off points. Each pattern ships with an interactive demo, guidelines (Material, HIG, Nielsen) and when to use it.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UX Patterns — Mobile UX Drop-off Atlas",
    description:
      "Mobile UX patterns catalog organized by user drop-off points for PMs & UX designers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";
import NextUI from "@/provider/nextui";
import { Roboto } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "vi" }];
}

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export default async function RootLayout({ children, params: { locale } }) {
  let messages;
  try {
    messages = (await import(`@/lang/${locale}/common.json`)).default;
  } catch (error) {
    notFound();
  }
  return (
    <html lang={locale}>
      <body suppressHydrationWarning={true} className={roboto.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <NextUI>{children}</NextUI>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
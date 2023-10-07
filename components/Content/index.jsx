"use client";
import { useTranslations } from "next-intl";

export default function Content({ children }) {
  const t = useTranslations("common");
  return (
    <main className="flex min-h-screen flex-col items-center py-24 px-6 md:px-0">
      {children}
    </main>
  );
}

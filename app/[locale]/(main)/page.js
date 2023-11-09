"use client";
import Image from "next/image";
import mainPic from "@/public/main_home.png";
import TypingAnimation from "@/components/TypingAnimation";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("home");
  const content = [
    t("book.ease"),
    t("book.good"),
    t("book.fast"),
    t("book.simple"),
  ];
  return (
    <div className="flex flex-wrap md:flex-nowrap justify-between">
      <div className="grow">
        <Image width={400} alt="NextUI hero Image" src={mainPic} />
      </div>
      <div className="flex items-center max-w-md">
        <div>
          <h1 className="text-xl">
            {t("obsfor") + " "}
            <span className="text-red-600	dark:text-violet-700">
              {t("allservices")}
            </span>
          </h1>
          <p>{t("intro")}</p>
          <h3 className="text-6xl">
            Booking{" "}
            <span className="block md:inline">
              <TypingAnimation content={content} />
            </span>
          </h3>
        </div>
      </div>
    </div>
  );
}

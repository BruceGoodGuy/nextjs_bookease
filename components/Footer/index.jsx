import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("common");
  return (
    <div className={"w-full max-w-[1024px] mx-auto px-6 py-1"}>
      <div className="flex flex-col justify-center md:justify-start">
        <div className="flex justify-between">
          <div>
            <p>{ t('contactme') }</p>
          </div>
          <div className="flex flex-row gap-2">
            <p>FB</p>
            <p>M</p>
          </div>
        </div>
        <p className="font-bold text-xl md:text-8xl my-1 md:my-2">BOOKEASE</p>
      </div>
      <div className="flex justify-between">
        <div>
          <p> © BookEase 2023</p>
        </div>
        <div className="flex flex-row gap-2">
          <p>KPI project 2023</p>
        </div>
      </div>
    </div>
  );
}

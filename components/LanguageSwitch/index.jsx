import { Button } from "@nextui-org/react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";
import { useTransition } from "react";

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (e) => {
    startTransition(() => {
      router.replace(pathname, { locale: locale === "en" ? "vi" : "en" });
    });
  };
  return (
    <Button
      isIconOnly
      aria-label="language"
      variant="light"
      size="sm"
      onPress={changeLanguage}
    >
      {locale === 'en' ? 'Vi' : 'En'}
    </Button>
  );
}

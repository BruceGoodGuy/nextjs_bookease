import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  Button,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import Link from "next/link";
import { Fragment, useState, useEffect } from "react";
import { Anek_Kannada } from "next/font/google";
import TypingAnimation from "@/components/TypingAnimation";
import ThemeSwitcher from "@/components/ThemeSwitch";
import LanguageSwitcher from "@/components/LanguageSwitch";
import { useTranslations } from "next-intl";

const anek = Anek_Kannada({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations("common");
  const content = [
    t("animationcontent.start"),
    t("animationcontent.usingnext"),
    t("animationcontent.bookingsystem"),
    t("animationcontent.letschill"),
  ];

  const menuItems = [
    { label: t("features"), href: "/features" },
    { label: t("customers"), href: "/customers" },
    { label: t("about"), href: "/about" },
  ];
  return (
    <Fragment>
      <div
        className={
          anek.className +
          " w-full max-w-[1024px] mx-auto px-6"
        }
      >
        <div className="flex gap-2 justify-between items-center">
          <div>
            <span className="flex-initial text-zinc-300">{t("madeby")}</span>
            <span className="flex-initial underline font-semibold mx-1">
              Bruce
            </span>
            <TypingAnimation content={content}></TypingAnimation>
          </div>
          <div className="flex align-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
      </div>
      <Navbar onMenuOpenChange={setIsMenuOpen} className="text-base md:text-lg">
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand>
            <Link href={"/"}>
              <p className={"font-bold text-inherit"}>BOOKEASE</p>
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link color="foreground" href="/features">
              {t("features")}
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link href="/customers" aria-current="page">
              {t("customers")}
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="/about">
              {t("about")}
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <Link href="#">{t("login")}</Link>
          </NavbarItem>
          <NavbarItem>
            <Button as={Link} color="primary" href="/signup" variant="bordered">
              {t("signup")}
            </Button>
          </NavbarItem>
        </NavbarContent>
        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.label}-${index}`}>
              <Link className="w-full" href={item.href} size="lg">
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    </Fragment>
  );
}

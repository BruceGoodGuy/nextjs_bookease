import { Moon } from "@/components/Icon/Moon";
import { Sun } from "@/components/Icon/Sun";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const changeTheme = (e) => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <Button
      isIconOnly
      aria-label="darkmode"
      variant="light"
      size="sm"
      onPress={changeTheme}
    >
      {theme === "light" ? <Moon /> : <Sun />}
    </Button>
  );
}

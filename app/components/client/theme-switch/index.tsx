"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { Switch } from "@nextui-org/react";
import { useTheme } from "next-themes";

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  return <Switch color={"primary"} startContent={<SunIcon />} endContent={<MoonIcon />} isSelected={theme === "dark"} onValueChange={(isSelected) => setTheme(isSelected ? "dark" : "light")} />;
};

export default ThemeSwitch;

"use client";
import { useTheme } from "@teispace/next-themes";
import { LuSun } from "react-icons/lu";
import { LuMoonStar } from "react-icons/lu";
import { CustomButton } from "./CustomButton";

export const SwitchTheme = ({ className }: { className?: string }) => {
  const { setTheme, theme } = useTheme();

  return (
    <CustomButton
      onClick={() => {
        setTheme(theme === "dark" ? "light" : "dark");
      }}
      className={className}
    >
      {theme === "dark" ? (
        <LuSun className="hidden dark:block" />
      ) : (
        <LuMoonStar className="block dark:hidden" />
      )}
    </CustomButton>
  );
};

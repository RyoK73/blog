"use client";
import { useTheme } from "@teispace/next-themes";
import { useState, useEffect } from "react";
import { LuSun } from "react-icons/lu";
import { LuMoonStar } from "react-icons/lu";
import { CustomButton } from "./CustomButton";

export const SwitchTheme = ({ className }: { className?: string }) => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // レンダーされたときに
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <CustomButton className={className}>
        <LuMoonStar />{" "}
      </CustomButton>
    );
  } else {
    return (
      <CustomButton
        onClick={() => {
          setTheme(theme === "dark" ? "light" : "dark");
        }}
        className={className}
      >
        {theme == "dark" ? <LuSun /> : <LuMoonStar />}
      </CustomButton>
    );
  }
};

import { IS_BROWSER } from "fresh/runtime";
import { signal, useComputed, useSignalEffect } from "@preact/signals";

export const themeSignal = signal("");

export const ThemeControllerInput = () => {
  if (IS_BROWSER) {
    let theme: string = globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches ? "synthwave" : "retro";

    document.cookie.split(";").forEach((cookie) => {
      const [name, value] = cookie.split("=");
      if (name.trim() === "theme") theme = value;
    });
    themeSignal.value = theme;
  }

  useSignalEffect(() => {
    document.documentElement.dataset.theme = themeSignal.value;
    document.cookie = `theme=${themeSignal.value}; SameSite=Strict`;
  });

  return (
    <input
      type="checkbox"
      className="theme-controller"
      value="synthwave"
      onChange={(e) => {
        if (!themeSignal.value) return;
        themeSignal.value = themeSignal.value === "retro" ? "synthwave" : "retro";
        (e.target as HTMLInputElement).checked = themeSignal.value === "synthwave";
      }}
    />
  );
};

export const FreshBadge = () => {
  const uri = useComputed(() => {
    return themeSignal.value === "retro" ? "https://fresh.deno.dev/fresh-badge.svg" : "https://fresh.deno.dev/fresh-badge-dark.svg";
  });

  return <img src={uri} alt="fresh" />;
};

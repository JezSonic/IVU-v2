import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18n from "@/lib/i18n";

export type ThemeMode = "light" | "dark" | "system";
export type UiLanguage = "en" | "pl"

interface SettingsStore {
	language: UiLanguage;
	setLanguage: (language: UiLanguage) => void;
	theme: ThemeMode;
	setTheme: (themeMode: ThemeMode) => void;
}

export const useSettingsStore = create<SettingsStore>()(
	persist((set) => (
		{
			language: "en",
			setLanguage: (lang: UiLanguage) => {
				i18n.changeLanguage(lang);
				set({ language: lang });
			},
			theme: "system",
			setTheme: (theme: ThemeMode) => set({ theme: theme })
		}),
		{ name: "irenka.settings" }
	));
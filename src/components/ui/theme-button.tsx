"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTranslation } from "next-i18next";

export default function ThemeButton({folded = false}: {folded?: boolean}) {
	const { theme, setTheme } = useSettingsStore();
	const { t } = useTranslation();
	const [systemPrefersDark, setSystemPrefersDark] = useState(false);

	useEffect(() => {
		const mm = window.matchMedia?.("(prefers-color-scheme: dark)");
		if (!mm) return;
		const update = () => setSystemPrefersDark(mm.matches);
		update();
		mm.addEventListener?.("change", update);
		return () => mm.removeEventListener?.("change", update);
	}, []);

	const isDarkEffective = theme === "dark" || (theme === "system" && systemPrefersDark);

	const toggle = () => {
		setTheme(isDarkEffective ? "light" : "dark");
	};

	return (
		<button
			onClick={toggle}
			aria-pressed={isDarkEffective}
			className={`flex items-center gap-3 px-3 py-3 transition-colors hover:bg-surface-muted ${folded ? "justify-center" : "justify-start"}`}
			title={isDarkEffective ? t("light_mode") : t("dark_mode")}
		>
			{isDarkEffective ? (
				<FontAwesomeIcon icon={faSun} className={"!h-4 !w-4 p-2 rounded bg-surface-muted"}/>
			) : (
				<FontAwesomeIcon icon={faMoon} className={"!h-4 !w-4 p-2 rounded bg-surface-muted"}/>
			)}
			{!folded && <>{isDarkEffective ? t("light_mode") : t("dark_mode")}</>}
		</button>
	);
}

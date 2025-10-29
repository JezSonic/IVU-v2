"use client";

import { useSettingsStore, UiLanguage } from "@/stores/settingsStore";
import { env } from "@/lib/helpers/app";
import { useTranslation } from "next-i18next";

export default function LanguageButton({ folded = false }: { folded?: boolean }) {
	const { t } = useTranslation();
	const { language, setLanguage } = useSettingsStore();
	const languages = env<UiLanguage[]>("available_languages");

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setLanguage(e.target.value as UiLanguage);
	};

	return (
		<label className={`flex items-center gap-3 px-3 py-3 ${folded ? "justify-center" : "justify-start"}`}>
			{/* Hidden accessible label for screen readers when folded */}
			<span className="sr-only">{t("settings.ui_language")}</span>
			<select
				aria-label={t("settings.ui_language")}
				value={language}
				onChange={handleChange}
				className={`bg-transparent text-sm outline-none cursor-pointer hover:bg-surface-muted rounded border border-transparent focus:border-border ${
					folded ? "w-16 text-center px-1 py-2" : "w-full py-3 px-3"
				}`}
			>
				{languages.map((l) => (
					<option key={l} value={l} className="bg-surface text-foreground">
						{folded ? l.toUpperCase() : t("language." + l)}
					</option>
				))}
			</select>
		</label>
	);
}

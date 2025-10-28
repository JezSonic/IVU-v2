import Sidebar from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useSettingsStore } from "@/stores/settingsStore";

export default function UI({children}: Readonly<{children: React.ReactNode; }>) {
	const path = usePathname();
	const { language, setLanguage } = useSettingsStore();
	const { i18n } = useTranslation();

	useEffect(() => {
		if (language == undefined) {
			setLanguage(i18n.language as any)
		} else {
			i18n.changeLanguage(language as any)
		}
	}, [])

	return (
		<div className="min-h-screen flex">
			{!path.includes("auth") && <Sidebar/>}
			<main className="flex-1 pt-14 md:pt-0">
				{children}
			</main>
		</div>
	)
}
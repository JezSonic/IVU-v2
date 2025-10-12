"use client";
import Card from "@/components/ui/card";
import { driverProfile } from "@/lib/data";
import defaultAvatar from "@/assets/img/avatar_default.png";
import { ThemeMode, UiLanguage, useSettingsStore } from "@/stores/settingsStore";
import { env } from "@/lib/helpers/app";
import { useTranslation } from "next-i18next";

export default function Settings() {
	const { language, setLanguage, theme, setTheme } = useSettingsStore();
	const { t } = useTranslation();
	const hasManyThemes = env<ThemeMode[]>("available_themes").length > 1
	const hasManyLanguages = env<UiLanguage[]>("available_languages").length > 1

	const handleLogout = () => {
		// Placeholder for logout logic
		alert("Logged out successfully!");
	};

	return (
		<div className="p-4 flex gap-3 flex-col flex-wrap">
			<h1 className="text-2xl font-bold">{t("settings")}</h1>
			<Card title={t("settings.profile")}>
				<div className="flex items-start gap-4">
					<div
						className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img src={driverProfile.avatarUrl || defaultAvatar.src} alt={driverProfile.name}
							 className="w-full h-full object-cover"/>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
						<div><span className="font-semibold">{t("settings.name")}:</span> {driverProfile.name}</div>
						<div><span className="font-semibold">{t("settings.employee_id")}:</span> {driverProfile.employeeId}</div>
						<div><span className="font-semibold">{t("settings.role")}:</span> {t(`settings.role.${driverProfile.role}`)}</div>
						<div><span className="font-semibold">{t("settings.section")}:</span> {driverProfile.section}</div>
						<div><span className="font-semibold">{t("settings.years_of_service")}:</span> {driverProfile.yearsOfService}
						</div>
						{driverProfile.phone &&
							<a href={`tel:${driverProfile.phone}`}>
								<span className="font-semibold">{t("settings.phone")}:</span> {driverProfile.phone}
							</a>}
						{driverProfile.email &&
							<a href={`mailto:${driverProfile.email}`}>
								<span className="font-semibold">{t("settings.email")}:</span> {driverProfile.email}
							</a>}
						{driverProfile.address && <div className="sm:col-span-2"><span
							className="font-semibold">{t("settings.address")}:</span> {driverProfile.address}</div>}
						{driverProfile.licenses?.length ? (
							<div className="sm:col-span-2">
								<span className="font-semibold">{t("settings.licenses")}:</span>
								<ul className="list-disc list-inside mt-1">
									{driverProfile.licenses.map((l, idx) => (
										<li key={idx}>{l.category}{l.validUntil ? ` (${t("settings.licenses.valid_until")} ${l.validUntil})` : ""}</li>
									))}
								</ul>
							</div>
						) : null}
					</div>
				</div>
				<p className="mt-3 text-xs text-gray-500 dark:text-gray-400">{t("settings.read_only")}</p>
			</Card>

			{/* Preferences Section */}
			{(hasManyThemes || hasManyLanguages) &&
				<Card>
					<h2 className="text-xl font-bold mb-4">{t("settings.preferences")}</h2>

					<div className="flex flex-col gap-4">
						{/* Language Selector */}
						{hasManyLanguages &&
							<div>
								<label htmlFor="language" className="text-lg font-semibold">{t("settings.ui_language")}</label>
								<select
									id="language"
									value={language}
									onChange={(e) => {
										setLanguage(e.target.value as any);
									}}
									className="mt-1 p-2 border border-gray-300 rounded-lg w-full bg-gray-700 dark:border-gray-600 dark:text-gray-100"
								>
									{env<UiLanguage[]>("available_languages").map(l => (
										<option key={l} value={l}>{t("language." + l)}</option>
									))}
								</select>
							</div>}

						{/* Theme Selector */}
						{hasManyThemes && <div>
							<label htmlFor="theme" className="text-lg font-semibold">{t("settings.ui_theme")}</label>
							<select
								id="theme"
								value={theme}
								onChange={(e) => setTheme(e.target.value as any)}
								className="mt-1 p-2 border border-gray-300 rounded-lg w-full bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
							>
								{env<ThemeMode[]>("available_themes").map(th => (
									<option key={th} value={th}>{t(th + "_mode")}</option>
								))}
							</select>
						</div>}
					</div>
				</Card>
			}

			{/* Logout Section */}
			<Card>
				<button
					onClick={handleLogout} disabled
					className="p-2 bg-red-600 text-white rounded-lg disabled:bg-red-900 disabled:cursor-not-allowed hover:not-disabled:bg-red-700 w-full dark:bg-red-500 dark:hover:not-disabled:bg-red-600"
				>
					{t("settings.log_out")}
				</button>
			</Card>
		</div>
	);
}

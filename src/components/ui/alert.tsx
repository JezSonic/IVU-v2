"use client";
import { useTranslation } from "next-i18next";

export default function Alert({
								  title, description, timestamp, severity
							  }: {
	title: string, description?: string, severity: "success" | "warning" | "error" | "info", timestamp: number
}) {
	const { i18n } = useTranslation();
	const baseClass = "p-4 flex gap-2 flex-col flex-wrap border-l-2";
	const classes = {
		"warning": "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30",
		"info": "border-blue-500 bg-blue-50 dark:bg-blue-900/30",
		"success": "border-green-500 bg-green-50 dark:bg-green-900/30",
		"error": "border-red-500 bg-red-50 dark:bg-red-900/30",
	};
	return (
		<div
			className={`${baseClass} ${classes[severity]}`}>
			<div className="flex flex-wrap gap-2 items-baseline text-foreground">
				<div className="text-base font-semibold">{title}</div>
				<span className="text-sm text-muted-foreground">{new Date(timestamp).toLocaleString(i18n.language)}</span>
			</div>
			<p className="text-sm text-foreground">{description}</p>
		</div>
	);
}
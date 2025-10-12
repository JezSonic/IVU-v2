"use client";
import React, { useMemo } from "react";
import Card from "@/components/ui/card";
import Alert from "@/components/ui/alert";
import { useTranslation } from "next-i18next";
import { Alert as AlertItem } from "@/lib/data.d"
import { useModal } from "@/components/modal/modal-provider";
import AlertModal from "@/app/alerts/alert-modal";

export default function AlertsPage() {
	const now = useMemo(() => new Date(), []);
	const { t } = useTranslation();
	const { openModal } = useModal();
	// Demo alerts list – in a real app these would come from an API
	const alerts: AlertItem[] = [
		{
			id: "a1",
			title: "Track maintenance near Katowice",
			description:
				"Expect minor delays on routes passing through Katowice between 12:00–16:00. Maintenance crew on site.",
			severity: "warning",
			timestamp: now.getTime() - 10 * 60 * 1000,
			meta: { location: "Katowice", time_window: "12:00–16:00" },
		},
		{
			id: "a2",
			title: "System update",
			description: "New timetable data has been loaded successfully.",
			severity: "success",
			timestamp: now.getTime() - 45 * 60 * 1000,
			meta: { applies_to: "Timetable Service", version: "2025.10.16" },
		},
		{
			id: "a3",
			title: "Crew change required",
			description:
				"Second train driver needed for Train 12345 after Poznań due to scheduling constraints.",
			severity: "error",
			timestamp: now.getTime() - 2 * 60 * 60 * 1000,
			meta: { train: "IC 12345", location: "Poznań" },
		},
		{
			id: "a4",
			title: "Information: Weather advisory",
			description: "Strong winds expected in Silesia region from 18:00. Monitor overhead lines.",
			severity: "info",
			timestamp: now.getTime() - 3 * 60 * 60 * 1000,
			meta: { region: "Silesia", time_window: "18:00" },
		},
	];

	return (
		<div className="p-4 flex gap-4 flex-col">
			<div className="flex flex-col gap-1">
				<h1 className="text-2xl font-bold">{t("alerts")}</h1>
				<p className="text-sm text-gray-400">{t("alerts.header")}</p>
			</div>

			<Card title={t("alerts.recent")}>
				<div className="flex flex-col divide-y divide-white/[.06] gap-2">
					{alerts.map((a) => (
						<button
							key={a.id}
							onClick={() => openModal(<AlertModal selected={a} />)}
							className="text-left hover:bg-white/[.06] focus:bg-white/[.08] rounded"
						>
							<Alert title={a.title} description={a.description} timestamp={a.timestamp}
								   severity={a.severity}/>
						</button>
					))}
					{alerts.length === 0 && (
						<div className="p-4 text-sm text-gray-600 dark:text-gray-400">{t("alerts.no_alerts")}</div>
					)}
				</div>
			</Card>
		</div>
	);
}

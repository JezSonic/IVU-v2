"use client";
import Alert from "@/components/ui/alert";
import Shift from "@/components/ui/shift";
import Card from "@/components/ui/card";
import Link from "next/link";
import { Alert as AlertItem, Shift as ShiftItem, TrainData } from "@/lib/data.d";
import { formatDate, formatTime, getDuration } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useSettingsStore } from "@/stores/settingsStore";
import { Paginated } from "@/lib/helpers/app";
import { alertsService, shiftsService, trainsService } from "@/services";
import AlertModal from "@/app/alerts/alert-modal";
import { useModal } from "@/components/modal/modal-provider";

export default function Home() {
	const router = useRouter();
	const [now, setNow] = useState<Date|undefined>();
	const { openModal } = useModal();
	const [alerts, setAlerts] = useState<Paginated<AlertItem[]>>()
	const [nextShift, setNextShift] = useState<ShiftItem|undefined>(undefined);
	const [trains, setTrains] = useState<TrainData[]|undefined>(undefined)
	const [totalShifts, setTotalShifts] = useState<number|undefined>(undefined);
	useEffect(() => {
		setNow(new Date())
		alertsService.list({page: 1, pageSize: 3})
			.then((data) => {
				setAlerts(data);
			})

		shiftsService.list().then((data) => {
			if (data.length > 0) {
				setNextShift(data[0]);
			}

			setTotalShifts(data.length)
		})

		trainsService.list().then((data) => {
			setTrains(data)
		})
	}, []);
	const {language} = useSettingsStore()
	const { t } = useTranslation();
	if (now == undefined) {
		return;
	}

	const dateStr = now.toLocaleDateString();
	const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	return (
		<div className="p-4 flex gap-4 flex-col">
			{/* Welcome / Hero */}
			<div className="flex flex-col gap-1">
				<h1 className="text-2xl font-bold">{t("welcome", { name: "Driver" })}</h1>
				<p className="text-sm text-gray-400">
					{t("today_is", { date: dateStr, time: timeStr })}
				</p>
			</div>

			{/* Quick Stats */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
				<Card onClick={() => router.push("/shifts")} className={"cursor-pointer hover:bg-surface/80"}>
					<div className="text-sm text-gray-400">{t("upcoming_shifts")}</div>
					<div className="text-2xl font-bold">{totalShifts}</div>
					{nextShift && (
						<div
							className="text-xs text-gray-400">{t("shifts.next")}: {formatDate(nextShift.startDate, language)} {formatTime(nextShift.startDate, language)}</div>
					)}
				</Card>
				<Card onClick={() => router.push("/alerts")} className={"cursor-pointer hover:bg-surface/80"}>
					<div className="text-sm text-gray-400">{t("alerts")}</div>
					<div className="text-2xl font-bold">3</div>
					<div className="text-xs text-gray-400">{t("latest_updates_below")}</div>
				</Card>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
				{/* Upcoming Shift Detailed */}
				<div className="lg:col-span-2 flex flex-col gap-3">
					<Card title={t("upcoming_shift")} className={"cursor-pointer hover:bg-surface/80"} onClick={() => nextShift && router.push(`shifts/?id=${nextShift.id}`)}
						  footer={<Link className="text-blue-400 hover:underline"
										href="/shifts">{t("view_all_shifts")}</Link>}>
						{nextShift ? (
							<Shift shift={nextShift}/>
						) : (
							<div className="text-sm text-gray-400">{t("no_upcoming_shift")}</div>
						)}
					</Card>

					{/* Recent Trains */}
					<Card title={t("upcoming_trains")}
						  footer={<Link className="text-blue-400 hover:underline"
										href="/trains">{t("go_to_train_search")}</Link>}>
						{trains == undefined ? (<p>{t("loading")}</p>) : (
							<div className="flex flex-col gap-2">
								{trains.slice(0, 3).map((t) => (
									<div key={t.number}
										 className="flex items-center justify-between p-2 rounded cursor-pointer bg-white/10 hover:bg-white/5" onClick={() => router.push(`trains?number=${t.number}`)}>
										<div className="flex flex-col">
											<div className="font-semibold">{t.number} {t.name ? `— ${t.name}` : ""}</div>
											<div className="text-xs text-gray-400">
												{t.startStation} ({formatTime(t.startDate, language)})
												→ {t.endStation} ({formatTime(t.endDate, language)})
											</div>
										</div>
										<div
											className="text-xs text-gray-400">{getDuration(t.startDate, t.endDate)}</div>
									</div>
								))}
								{trains.length === 0 && (
									<div
										className="text-sm text-gray-400">{t("no_trains_scheduled")}</div>
								)}
							</div>
						)}
					</Card>
				</div>

				{/* Alerts and Quick Actions */}
				<div className="flex flex-col gap-3">
					<Card title={t("alerts")} footer={<Link className="text-blue-400 hover:underline" href="/alerts">{t("view_all_alerts")}</Link>}>
						<div className="flex flex-col gap-3">
							{alerts == undefined ? <p>{t("loading")}</p> :
								alerts.data.length > 0 ? (
									alerts.data.map((a) => (
										<button
											key={a.id}
											onClick={() => openModal(<AlertModal selected={a} />)}
											className="text-left hover:bg-white/[.06] focus:bg-white/[.08] rounded"
										>
											<Alert title={a.title} description={a.description} timestamp={a.timestamp}
												   severity={a.severity}/>
										</button>
									))
								) : <p>{t("alerts.no_alerts")}</p>

							}
						</div>
					</Card>

					<Card title={t("quick_actions")}>
						<div className="grid grid-cols-2 gap-2">
							<Link href="/trains"
								  className="p-3 rounded bg-blue-600 text-white text-center hover:bg-blue-700">{t("find_train")}</Link>
							<Link href="/shifts"
								  className="p-3 rounded bg-emerald-600 text-white text-center hover:bg-emerald-700">{t("view_shifts")}</Link>
							<Link href="/settings"
								  className="p-3 rounded bg-gray-800 text-white text-center hover:bg-gray-900">{t("settings")}</Link>
							<Link href="/"
								  className="p-3 rounded bg-indigo-600 text-white text-center hover:bg-indigo-700">{t("dashboard")}</Link>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}

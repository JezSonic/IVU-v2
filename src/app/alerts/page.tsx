"use client";
import React, { useEffect, useState } from "react";
import Card from "@/components/ui/card";
import Alert from "@/components/ui/alert";
import { useTranslation } from "next-i18next";
import { Alert as AlertItem } from "@/lib/data.d";
import { useModal } from "@/components/modal/modal-provider";
import AlertModal from "@/app/alerts/alert-modal";
import { Paginated } from "@/lib/helpers/app";
import { alertsService } from "@/services";
import Paginator from "@/components/ui/paginator";

export default function AlertsPage() {
	const { t } = useTranslation();
	const { openModal } = useModal();
	const [alerts, setAlerts] = useState<Paginated<AlertItem[]>>();
	const [infoAlerts, setInfoAlerts] = useState<Paginated<AlertItem[]>>();
	const [warningAlerts, setWarningAlerts] = useState<Paginated<AlertItem[]>>();
	const [errorAlerts, setErrorAlerts] = useState<Paginated<AlertItem[]>>();
	const getAlerts = (page: number = 1) => {
		setAlerts(undefined);

		alertsService.list({ unreadOnly: false, page: page })
			.then((response) => {
				setAlerts(response);
			});
	};
	const getInfoAlerts = (page: number = 1) => {
		setInfoAlerts(undefined);

		alertsService.list({ unreadOnly: false, page: page, severity: "info", pageSize: 3 })
			.then((response) => {
				setInfoAlerts(response);
			});
	};
	const getWarningAlerts = (page: number = 1) => {
		setWarningAlerts(undefined);

		alertsService.list({ unreadOnly: false, page: page, severity: "warning", pageSize: 3 })
			.then((response) => {
				setWarningAlerts(response);
			});
	};
	const getErrorAlerts = (page: number = 1) => {
		setErrorAlerts(undefined);

		alertsService.list({ unreadOnly: false, page: page, severity: "error", pageSize: 3 })
			.then((response) => {
				setErrorAlerts(response);
			});
	};
	useEffect(() => {
		getAlerts();
		getInfoAlerts();
		getWarningAlerts();
		getErrorAlerts();
	}, []);

	const PaginatedAlerts = ({ alerts }: { alerts: Paginated<AlertItem[]> }) => {
		return (
			<div className={"w-full h-full"}>
				{alerts.data.length > 0 &&
					<div className={"flex flex-col gap-3"}>
						{alerts.data.map((a) => (
							<button
								key={a.id}
								onClick={() => openModal(<AlertModal selected={a}/>)}
								className="text-left hover:bg-white/[.06] focus:bg-white/[.08] rounded"
							>
								<Alert title={a.title} description={a.description} timestamp={a.timestamp}
									   severity={a.severity}/>
							</button>
						))}
					</div>
				}
				{alerts.data.length === 0 && (
					<div
						className="p-4 text-sm text-gray-600 dark:text-gray-400 w-full min-h-full text-center">{t("alerts.no_alerts")}</div>
				)}
			</div>
		);
	};
	return (
		<div className="p-4 flex gap-4 flex-col">
			<div className="flex flex-col gap-1">
				<h1 className="text-2xl font-bold">{t("alerts")}</h1>
				<p className="text-sm text-gray-400">{t("alerts.header")}</p>
			</div>
			<Card title={t("alerts.recent")}
				  className={"min-h-[500px] h-min flex flex-col"}>
				<div className={`flex flex-col flex-1 gap-4 ${alerts == undefined ? "justify-center" : "justify-between"} min-h-full`}>
					{alerts == undefined ? <p className={"text-center"}>{t("loading")}</p> : <PaginatedAlerts alerts={alerts}/>}
					{alerts !== undefined && <Paginator page={alerts.page} all_pages={alerts.all_pages} onNextPageClicked={() => getAlerts(++alerts.page)} onPreviousPageClicked={() => getAlerts(--alerts.page)}/>}
				</div>
			</Card>

			<div className="grid xl:grid-cols-3 gap-3 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1">
				<Card title={`${t("alerts")}: ${t("alerts.severity.info.plural")}`}
					  className={"min-h-[500px] h-min flex flex-col"}>
					<div className={`flex flex-col flex-1 gap-4 ${infoAlerts == undefined ? "justify-center" : "justify-between"} min-h-full`}>
						{infoAlerts == undefined ? <p className={"text-center"}>{t("loading")}</p> : <PaginatedAlerts alerts={infoAlerts}/>}
						{infoAlerts !== undefined && <Paginator page={infoAlerts.page} all_pages={infoAlerts.all_pages} onNextPageClicked={() => getInfoAlerts(++infoAlerts.page)} onPreviousPageClicked={() => getInfoAlerts(--infoAlerts.page)}/>}
					</div>
				</Card>
				<Card title={`${t("alerts")}: ${t("alerts.severity.error.plural")}`}
					  className={"min-h-[500px] h-min flex flex-col"}>
					<div className={`flex flex-col flex-1 gap-4 ${errorAlerts == undefined ? "justify-center" : "justify-between"} min-h-full`}>
						{errorAlerts == undefined ? <p className={"text-center"}>{t("loading")}</p> : <PaginatedAlerts alerts={errorAlerts}/>}
						{errorAlerts !== undefined && <Paginator page={errorAlerts.page} all_pages={errorAlerts.all_pages} onNextPageClicked={() => getErrorAlerts(++errorAlerts.page)} onPreviousPageClicked={() => getErrorAlerts(--errorAlerts.page)}/>}
					</div>
				</Card>
				<Card title={`${t("alerts")}: ${t("alerts.severity.warning.plural")}`}
					  className={"min-h-[500px] h-min flex flex-col"}>
					<div className={`flex flex-col flex-1 gap-4 ${warningAlerts == undefined ? "justify-center" : "justify-between"} min-h-full`}>
						{warningAlerts == undefined ? <p className={"text-center"}>{t("loading")}</p> : <PaginatedAlerts alerts={warningAlerts}/>}
						{warningAlerts !== undefined && <Paginator page={warningAlerts.page} all_pages={warningAlerts.all_pages} onNextPageClicked={() => getWarningAlerts(++warningAlerts.page)} onPreviousPageClicked={() => getWarningAlerts(--warningAlerts.page)}/>}
					</div>
				</Card>
			</div>
		</div>
	);
}

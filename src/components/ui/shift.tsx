"use client";
import { shifts } from "@/lib/data";
import React from "react";
import { useTranslation } from "next-i18next";
import useWindowSize from "@/hooks/use-window-size";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft, faCalendar, faClock } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

export default function Shift({ shift, detailed = false }: { shift: (typeof shifts)[0], detailed?: boolean }) {
	const router = useRouter();
	const { t, i18n } = useTranslation();
	const { isMobile } = useWindowSize();
	const desktopTable = () => {
		return (
			<table
				className="min-w-full text-sm border border-gray-700 rounded-md overflow-hidden bg-surface">
				<thead className="bg-gray-800/50 text-white">
				<tr>
					<th className="px-3 py-2 text-left font-semibold">{t("shift.type")}</th>
					<th className="px-3 py-2 text-left font-semibold">{t("shift.shift_type")}</th>
					<th className="px-3 py-2 text-left font-semibold">{t("shift.journey")}</th>
					<th className="px-3 py-2 text-left font-semibold">{t("shift.from")}</th>
					<th className="px-3 py-2 text-left font-semibold">{t("shift.to")}</th>
					<th className="px-3 py-2 text-left font-semibold">{t("assigned_vehicle")}</th>
				</tr>
				</thead>
				<tbody>
				{shift.operations?.map((op, idx) => (
					<tr key={idx} className="border-t border-gray-700">
						<td className="px-3 py-2 align-top">{t(`shift.type.${op.type}`)}</td>
						<td className="px-3 py-2 align-top">{op.shiftType ? t(`shift.shift_type.${op.shiftType}`) : "—"}</td>
						<td className="px-3 py-2 align-top cursor-pointer" onClick={() => router.push(`trains?number=${op.trainNumber}`)}>{op.trainNumber ?? "—"}</td>
						<td className="px-3 py-2 align-top">{op.fromStation}, {op.startTime.toLocaleTimeString(i18n.language, {
							hour: "2-digit",
							minute: "2-digit"
						})}</td>
						<td className="px-3 py-2 align-top">{op.toStation}, {op.endTime.toLocaleTimeString(i18n.language, {
							hour: "2-digit",
							minute: "2-digit"
						})}</td>
						<td className="px-3 py-2 align-top">{op.vehicleType}</td>
					</tr>
				))}
				{(!shift.operations || shift.operations.length === 0) && (
					<tr>
						<td colSpan={6} className="px-3 py-3 text-center text-muted-foreground">{t("shifts.no-operations")}</td>
					</tr>
				)}
				</tbody>
			</table>
		);
	};

	const mobileTable = () => {
		return (
			<div className="space-y-4">
				{shift.operations?.map((op, idx) => (
					<div key={idx} className="p-4 border border-gray-700 rounded-md space-y-2 bg-surface">
						<div className="flex justify-between items-center">
							<span className="font-semibold text-sm">{t("shift.type")}:</span>
							<span className="text-sm">{t(`shift.type.${op.type}`)}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="font-semibold text-sm">{t("shift.shift_type")}:</span>
							<span className="text-sm">{op.shiftType ? t(`shift.shift_type.${op.shiftType}`) : "—"}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="font-semibold text-sm">{t("shift.journey")}:</span>
							<span className="text-sm cursor-pointer" onClick={() => router.push(`trains?number=${op.trainNumber}`)}>{op.trainNumber ?? "—"}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="font-semibold text-sm">{t("shift.from")}:</span>
							<span
								className="text-sm text-right">{op.fromStation}, {op.startTime.toLocaleTimeString(i18n.language, {
								hour: "2-digit",
								minute: "2-digit"
							})}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="font-semibold text-sm">{t("shift.to")}:</span>
							<span
								className="text-sm text-right">{op.toStation}, {op.endTime.toLocaleTimeString(i18n.language, {
								hour: "2-digit",
								minute: "2-digit"
							})}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="font-semibold text-sm">{t("assigned_vehicle")}:</span>
							<span className="text-sm">{op.vehicleType}</span>
						</div>
					</div>
				))}
				{(!shift.operations || shift.operations.length === 0) && (
					<div className="text-center text-muted-foreground p-4">{t("shifts.no-operations")}</div>
				)}
			</div>
		);
	};
	if (detailed) {
		return (
			<div className="space-y-4">
				<div className="flex items-start gap-2">
					<FontAwesomeIcon icon={faCalendar} className="mt-1 size-4 shrink-0"/>
					<div>
						<p className="text-sm font-medium">{t("shift.start_date")}</p>
						<p className="text-sm text-muted-foreground">{shift.startDate.toLocaleDateString(i18n.language, {
							year: "numeric",
							month: "short",
							day: "numeric",
							hour: "numeric",
							minute: "numeric",
						})} - {shift.from}</p>
					</div>
				</div>

				<div className="flex items-start gap-2">
					<FontAwesomeIcon icon={faClock} className="mt-1 size-4 shrink-0"/>
					<div>
						<p className="text-sm font-medium">{t("shift.end_date")}</p>
						<p className="text-sm text-muted-foreground">{shift.endDate.toLocaleDateString(i18n.language, {
							year: "numeric",
							month: "short",
							day: "numeric",
							hour: "numeric",
							minute: "numeric",
						})} - {shift.to}</p>
					</div>
				</div>

				<div className="flex items-start gap-2">
					<FontAwesomeIcon icon={faAlignLeft} className="mt-1 size-4 shrink-0"/>
					<div>
						<p className="text-sm font-medium"><strong>{t("shift.location")}</strong>: {shift.location}</p>
						<p className="text-sm font-medium"><strong>{t("shift.depot")}</strong>: {shift.depot}</p>
						<p className="text-sm font-medium"><strong>{t("shift.type")}</strong>: {shift.type}</p>
						<p className="text-sm font-medium"><strong>{t("shift.crew_type")}</strong>: {t(`crew_details.${shift.crewType}`)}</p>
					</div>
				</div>

				<div className="flex items-start gap-2 flex-col">
					<p>{t("crew_details")}:</p>
					<ul className="text-sm font-medium list-disc list-inside">
						{shift.crewDetails?.map((member, index) => (
							<li key={index}>
								<strong>{t(`crew_details.${member.role}`)}:</strong> {member.name}, {member.section}
							</li>
						))}
					</ul>
				</div>

				<div className="flex items-start gap-2 flex-col">
					<p>{t("shift.details")}</p>
					<div className="overflow-x-auto w-full">
						{isMobile ? mobileTable() : desktopTable()}
					</div>
				</div>
			</div>
		);
	}
	return (
		<div className={"space-y-4"}>
			<div className="flex items-start gap-2">
				<FontAwesomeIcon icon={faCalendar} className="mt-1 size-4 shrink-0"/>
				<div>
					<p className="text-sm font-medium">{t("shift.start_date")}</p>
					<p className="text-sm text-muted-foreground">{shift.startDate.toLocaleDateString(i18n.language, {
						year: "numeric",
						month: "short",
						day: "numeric",
						hour: "numeric",
						minute: "numeric",
					})} - {shift.from}</p>
				</div>
			</div>

			<div className="flex items-start gap-2">
				<FontAwesomeIcon icon={faClock} className="mt-1 size-4 shrink-0"/>
				<div>
					<p className="text-sm font-medium">{t("shift.end_date")}</p>
					<p className="text-sm text-muted-foreground">{shift.endDate.toLocaleDateString(i18n.language, {
						year: "numeric",
						month: "short",
						day: "numeric",
						hour: "numeric",
						minute: "numeric",
					})} - {shift.to}</p>
				</div>
			</div>
		</div>
	);
}
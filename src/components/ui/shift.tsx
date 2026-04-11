"use client";
import { shifts } from "@/lib/data";
import React from "react";
import { useTranslation } from "react-i18next";
import useWindowSize from "@/hooks/use-window-size";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft, faCalendar, faClock } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
		const journeys = shift.operations?.filter(op => op.trainNumber);
		return (
			<div className="space-y-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Left column: Shift details */}
					<div className="space-y-4">
						<h3 className="font-bold text-lg border-b border-gray-700 pb-2">{t("shift.details")}</h3>
						<div className="space-y-4">
							<div className="flex items-start gap-3">
								<FontAwesomeIcon icon={faCalendar} className="mt-1 size-4 text-blue-400 shrink-0"/>
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

							<div className="flex items-start gap-3">
								<FontAwesomeIcon icon={faClock} className="mt-1 size-4 text-blue-400 shrink-0"/>
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

							<div className="flex items-start gap-3">
								<FontAwesomeIcon icon={faAlignLeft} className="mt-1 size-4 text-blue-400 shrink-0"/>
								<div>
									<p className="text-sm font-medium"><strong>{t("shift.location")}</strong>: {shift.location}</p>
									<p className="text-sm font-medium"><strong>{t("shift.depot")}</strong>: {shift.depot}</p>
									<p className="text-sm font-medium"><strong>{t("shift.type")}</strong>: {shift.type}</p>
									<p className="text-sm font-medium"><strong>{t("shift.crew_type")}</strong>: {t(`crew_details.${shift.crewType}`)}</p>
								</div>
							</div>

							<div className="pt-4 border-t border-gray-700">
								<p className="text-sm font-bold mb-2 uppercase tracking-wider text-gray-400">{t("crew_details")}</p>
								<ul className="text-sm font-medium space-y-1">
									{shift.crewDetails?.map((member, index) => (
										<li key={index} className="flex gap-2">
											<span className="text-gray-400 min-w-[120px]">{t(`crew_details.${member.role}`)}:</span>
											<span>{member.name}, {member.section}</span>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>

					{/* Right column: Journey details */}
					<div className="space-y-4">
						<h3 className="font-bold text-lg border-b border-gray-700 pb-2">{t("shift.journey_details")}</h3>
						<div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
							{journeys?.map((op, idx) => (
								<div key={idx} className="p-4 bg-gray-800/30 rounded-lg border border-gray-700 space-y-3">
									<div className="flex justify-between items-center">
										<p className="font-bold text-blue-400">Journey {op.trainNumber}</p>
										<span className="text-xs text-gray-400">{op.fromStation} → {op.toStation}</span>
									</div>
									<div className="text-sm space-y-1">
										<p><span className="text-gray-400">{t("shift.length")}:</span> {op.length ?? "—"}m</p>
										<p><span className="text-gray-400">{t("shift.weight")}:</span> {op.weight ?? "—"}t</p>
										<p><span className="text-gray-400">{t("shift.rolling_stock")}:</span> <span className="text-xs font-mono">{op.rollingStock ?? "—"}</span></p>
									</div>

									{op.vehicles && op.vehicles.length > 0 && (
										<div className="mt-3 overflow-x-auto">
											<table className="min-w-full text-[10px] border border-gray-700">
												<thead className="bg-gray-800 text-gray-300">
													<tr>
														<th className="px-1 py-1 border-r border-gray-700">{t("shift.vehicles.lp")}</th>
														<th className="px-1 py-1 border-r border-gray-700">{t("shift.vehicles.country")}</th>
														<th className="px-1 py-1 border-r border-gray-700">{t("shift.vehicles.operator")}</th>
														<th className="px-1 py-1 border-r border-gray-700">{t("shift.vehicles.type")}</th>
														<th className="px-1 py-1 border-r border-gray-700">{t("shift.vehicles.number")}</th>
														<th className="px-1 py-1 border-r border-gray-700">{t("shift.vehicles.length")}</th>
														<th className="px-1 py-1 border-r border-gray-700">{t("shift.vehicles.load_weight")}</th>
														<th className="px-1 py-1">{t("shift.vehicles.own_weight")}</th>
													</tr>
												</thead>
												<tbody className="divide-y divide-gray-700">
													{op.vehicles.map((v, vIdx) => (
														<tr key={vIdx} className="bg-gray-900/50">
															<td className="px-1 py-1 border-r border-gray-700 text-center">{v.id}</td>
															<td className="px-1 py-1 border-r border-gray-700 text-center">{v.country}</td>
															<td className="px-1 py-1 border-r border-gray-700 text-center">{v.operator}</td>
															<td className="px-1 py-1 border-r border-gray-700 text-center font-bold">{v.type}</td>
															<td className="px-1 py-1 border-r border-gray-700 font-mono">{v.number}</td>
															<td className="px-1 py-1 border-r border-gray-700 text-right">{v.length}</td>
															<td className="px-1 py-1 border-r border-gray-700 text-right">{v.loadWeight ?? "—"}</td>
															<td className="px-1 py-1 text-right">{v.ownWeight}</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									)}

									<div className="flex gap-2 pt-2">
										<Button size="xs" variant="outline" className="flex-1" onClick={() => alert("Downloading schedule...")}>{t("shift.download_schedule")}</Button>
										<Button size="xs" variant="outline" className="flex-1" onClick={() => alert("Viewing schedule...")}>{t("shift.view_schedule")}</Button>
									</div>
								</div>
							))}
							{(!journeys || journeys.length === 0) && (
								<p className="text-sm text-gray-500 italic">{t("shifts.no-operations")}</p>
							)}
						</div>
					</div>
				</div>

				<div className="space-y-4 pt-4 border-t border-gray-700">
					<h3 className="font-bold text-lg">{t("shift.operations")}</h3>
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
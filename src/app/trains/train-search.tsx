"use client";

import { KeyboardEvent, useEffect, useState } from "react";
import Card from "@/components/ui/card";
import { TrainData } from "@/lib/data.d";
import { formatDate, formatTime, getDuration } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import { trainsService } from "@/services";

export default function TrainSearch() {
	const params = useSearchParams();
	const number = params.get("number");
	const [trainNumber, setTrainNumber] = useState<string>("");
	const [trainDetails, setTrainDetails] = useState<TrainData | null>(null);
	const [trains, setTrains] = useState<TrainData[]>([]);
	const [hasSearched, setHasSearched] = useState(false);
	const { t, i18n } = useTranslation();
	const handleSearch = (number: string) => {
		const num = parseInt(number, 10);
		if (isNaN(num)) {
			setTrainDetails(null);
			setHasSearched(true);
			return;
		}

		trainsService.getById(num)
			.then(data => {
				setTrainDetails(data);
			})
		setHasSearched(true);
	};

	useEffect(() => {
		trainsService.list()
			.then(data => {
				setTrains(data);
			})
	}, []);

	useEffect(() => {
		if (number == null) {
			return;
		}
		setTrainNumber(number);
		handleSearch(number);
	}, [number])

	const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleSearch(trainNumber);
		}
	};

	return (
		<div className="p-4 flex gap-3 flex-col flex-wrap">
			<div>
				<h1 className="text-2xl font-bold">{t("trains.search")}</h1>
				{trains[0] == undefined ? (<p className="text-sm text-gray-600 dark:text-gray-400">{t("loading")}</p>) : (
					<p className="text-sm text-gray-600 dark:text-gray-400">{t("trains.search.description")} {[trains[0].number, trains[10].number, trains[20].number].join(", ")}</p>)}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
				<Card className="md:sticky md:top-4 self-start">
					<div className="flex flex-col gap-3">
						<label htmlFor="trainNumber"
							   className="text-base font-semibold">{t("trains.enter-number")}</label>
						<input
							id="trainNumber"
							inputMode="numeric"
							pattern="[0-9]*"
							type="text"
							placeholder={t("trains.enter-number.placeholder", {
								number: trains[9] == undefined ? t("loading") : trains[9].number
							})}
							value={trainNumber}
							onChange={(e) => setTrainNumber(e.target.value.replace(/\D+/g, ""))}
							onKeyDown={onKeyDown}
							className="p-2 border border-gray-300 rounded-lg bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
						/>
						<div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400 items-center">
							<span>{t("trains.enter-number.examples")}</span>
							{trains[0] == undefined ? (<span>{t("loading")}</span>) :
								(
									[trains[0].number, trains[10].number, trains[20].number].map((ex) => (
										<button
											type="button"
											key={ex}
											onClick={() => setTrainNumber(ex.toString())}
											className="px-2 py-1 rounded bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15"
										>
											{ex}
										</button>
									))
								)}
						</div>
						<button
							onClick={() => {handleSearch(trainNumber)}}
							className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
						>
							{t("search")}
						</button>
					</div>
				</Card>

				<div className="md:col-span-2 flex flex-col gap-3">
					{!hasSearched && (
						<Card>
							<div className="flex flex-col gap-2">
								<div className="text-lg font-semibold">{t("trains.no-search")}</div>
								<p className="text-sm text-gray-700 dark:text-gray-300">{t("trains.no-search.description")}</p>
							</div>
						</Card>
					)}

					{hasSearched && !trainDetails && (
						<Card>
							<div className="flex flex-col gap-2">
								<div
									className="text-lg font-semibold text-red-600 dark:text-red-400">{t("trains.no-results")}</div>
								<p className="text-sm text-gray-700 dark:text-gray-300">{t("trains.no-results.description", { number: trainNumber || "(empty)" })}</p>
							</div>
						</Card>
					)}

					{trainDetails && (
						<Card>
							<div className="flex flex-col gap-2">
								<div className="flex flex-wrap items-baseline gap-2">
									<h2 className="text-xl font-bold">
										<strong><i>{trainDetails.type}</i></strong> {trainDetails.number} "{trainDetails.name.toUpperCase()}"
									</h2>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
									<div className="p-3 rounded-lg bg-black/5 dark:bg-white/10">
										<div
											className="text-sm text-gray-600 dark:text-gray-400">{t("train.departure")}</div>
										<div
											className="text-base font-semibold">{trainDetails.startStation || "—"}</div>
										<div className="text-sm text-gray-600 dark:text-gray-400">
											{formatDate(trainDetails.startDate, i18n.language)} • {formatTime(trainDetails.startDate, i18n.language)}
										</div>
									</div>
									<div className="p-3 rounded-lg bg-black/5 dark:bg-white/10">
										<div
											className="text-sm text-gray-600 dark:text-gray-400">{t("train.arrival")}</div>
										<div className="text-base font-semibold">{trainDetails.endStation || "—"}</div>
										<div className="text-sm text-gray-600 dark:text-gray-400">
											{formatDate(trainDetails.endDate, i18n.language)} • {formatTime(trainDetails.endDate, i18n.language)}
										</div>
									</div>
								</div>

								<div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
									{t("route_duration")}: {getDuration(trainDetails.startDate, trainDetails.endDate)}
								</div>

								<div className="mt-3">
									<div className="text-lg font-semibold mb-2">{t("crew_details")}</div>
									<ul className="list-disc list-inside text-sm">
										{trainDetails.crewDetails.map((member, index) => (
											<li key={index}>
												{member.name} {member.section ? `— ${member.section}` : ""}
											</li>
										))}
									</ul>
								</div>

								<div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
										<div>
											<span className="text-gray-500 dark:text-gray-400">{t("shift.length")}: </span>
											<span className="font-medium">{trainDetails.length ?? "—"} m</span>
										</div>
										<div>
											<span className="text-gray-500 dark:text-gray-400">{t("shift.weight")}: </span>
											<span className="font-medium">{trainDetails.weight ?? "—"} t</span>
										</div>
										<div className="sm:col-span-2">
											<span className="text-gray-500 dark:text-gray-400">{t("shift.rolling_stock")}: </span>
											<span className="font-medium italic text-xs font-mono">{trainDetails.rollingStock ?? "—"}</span>
										</div>
									</div>

									{trainDetails.vehicles && trainDetails.vehicles.length > 0 && (
										<div className="mt-3 overflow-x-auto">
											<table className="min-w-full text-[10px] border border-gray-200 dark:border-gray-700">
												<thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
													<tr>
														<th className="px-1 py-1 border-r border-gray-200 dark:border-gray-700">{t("shift.vehicles.lp")}</th>
														<th className="px-1 py-1 border-r border-gray-200 dark:border-gray-700">{t("shift.vehicles.country")}</th>
														<th className="px-1 py-1 border-r border-gray-200 dark:border-gray-700">{t("shift.vehicles.operator")}</th>
														<th className="px-1 py-1 border-r border-gray-200 dark:border-gray-700">{t("shift.vehicles.type")}</th>
														<th className="px-1 py-1 border-r border-gray-200 dark:border-gray-700">{t("shift.vehicles.number")}</th>
														<th className="px-1 py-1 border-r border-gray-200 dark:border-gray-700">{t("shift.vehicles.length")}</th>
														<th className="px-1 py-1 border-r border-gray-200 dark:border-gray-700">{t("shift.vehicles.load_weight")}</th>
														<th className="px-1 py-1">{t("shift.vehicles.own_weight")}</th>
													</tr>
												</thead>
												<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
													{trainDetails.vehicles.map((v, vIdx) => (
														<tr key={vIdx} className="bg-white dark:bg-gray-900/50">
															<td className="px-1 py-1 border-r border-gray-200 dark:border-gray-700 text-center">{v.id}</td>
															<td className="px-1 py-1 border-r border-gray-200 dark:border-gray-700 text-center">{v.country}</td>
															<td className="px-1 py-1 border-r border-gray-200 dark:border-gray-700 text-center">{v.operator}</td>
															<td className="px-1 py-1 border-r border-gray-200 dark:border-gray-700 text-center font-bold">{v.type}</td>
															<td className="px-1 py-1 border-r border-gray-200 dark:border-gray-700 font-mono">{v.number}</td>
															<td className="px-1 py-1 border-r border-gray-200 dark:border-gray-700 text-right">{v.length}</td>
															<td className="px-1 py-1 border-r border-gray-200 dark:border-gray-700 text-right">{v.loadWeight ?? "—"}</td>
															<td className="px-1 py-1 text-right">{v.ownWeight}</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									)}

									<div className="flex gap-2 mt-4">
										<button 
											className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
											onClick={() => alert("Downloading schedule...")}
										>
											{t("shift.download_schedule")}
										</button>
										<button 
											className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
											onClick={() => alert("Viewing schedule...")}
										>
											{t("shift.view_schedule")}
										</button>
									</div>
								</div>

								<div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
									{t("demo_content")}
								</div>
							</div>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}

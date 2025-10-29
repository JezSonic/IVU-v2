"use client";

import { KeyboardEvent, useEffect, useState } from "react";
import Card from "@/components/ui/card";
import { TrainData } from "@/lib/data.d";
import { formatDate, formatTime, getDuration } from "@/lib/utils";
import { useTranslation } from "next-i18next";
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

								{"assignedLoco" in trainDetails && (
									<div className="mt-2 text-sm">
										<strong>{t("assigned_vehicle")}:</strong> {(trainDetails as any).assignedLoco || "—"}
									</div>
								)}

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

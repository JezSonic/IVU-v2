import React, { Suspense } from "react";
import TrainSearch from "@/app/trains/train-search";
import { useTranslation } from "next-i18next";

export default function Trains() {
	// const { t } = useTranslation();
	const fallback = () => {
		return (
			<div className="p-4 flex gap-3 flex-col flex-wrap w-full h-full text-center items-center justify-center">
				<h1 className="text-2xl font-bold">
					{/*{t("loading")}*/}
				</h1>
			</div>
		)
	}
	return (
		<Suspense fallback={fallback()}>
			<TrainSearch />
		</Suspense>
	)
}
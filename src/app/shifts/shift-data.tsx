import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Shift from "@/components/ui/shift";
import React, { useEffect, useState } from "react";
import { Shift as ShiftType } from "@/lib/data.d"
import { useRouter, useSearchParams } from "next/navigation";
import { shiftsService, ShiftsService } from "@/services";
import { CalendarProvider } from "@/context/calendar-context";
import { shifts } from "@/lib/data";
import { ClientContainer } from "@/components/calendar/client-container";
import useWindowSize from "@/hooks/use-window-size";
import { useTranslation } from "next-i18next";

export default function ShiftData() {
	const router = useRouter();
	const { isMobile } = useWindowSize();
	const params = useSearchParams();
	const { t } = useTranslation();
	const id = params.get("id");
	const [displayShift, setDisplayShift] = useState(false);
	const [_shift, setShift] = useState<ShiftType | undefined>(undefined);
	const [shifts, setShifts] = useState<ShiftType[]|undefined>();
	useEffect(() => {
		// Only run the effect if the id is available
		if (id != null) {
			setDisplayShift(true);
			setShift(new ShiftsService().getById(id));
			return;
		} else {
			shiftsService.list()
			.then(shifts => {
				setShifts(shifts);
			})
		}

		setDisplayShift(false);
	}, [id]);

	const shiftData = () => {
		return (<div className={"p-4"}>
			{_shift !== undefined ? <div className={"flex flex-col gap-3"}>
				<Button className={"bg-surface/50 w-min"} variant={"ghost"} onClick={() => {router.push('shifts')}}>
					<FontAwesomeIcon icon={faChevronLeft}/>
					<p>{t("shifts.go-back")}</p>
				</Button>
				<h1 className="text-xl font-bold">{_shift.id}</h1>
				<Shift shift={_shift} detailed/>
			</div> : <p>{t("shifts.not-found")}</p>}
		</div>);
	};

	const shiftCalendar = () => {
		return (
			<div className="p-4 flex gap-3 flex-col flex-wrap">
				<h1 className="text-2xl font-bold">{t("shifts.header")}</h1>
				{shifts == undefined ? <p>{t("loading")}</p> : (
					<CalendarProvider users={[]} events={shifts}>
						<ClientContainer view={isMobile ? "agenda" : "month"}/>
					</CalendarProvider>
				)}
			</div>
		);
	};
	return (
		<>
			{displayShift ? shiftData() : shiftCalendar()}
		</>
	);
}
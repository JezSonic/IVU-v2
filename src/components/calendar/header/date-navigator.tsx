import { useMemo } from "react";
import { useCalendar } from "@/context/calendar-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getEventsCount, navigateDate, rangeText } from "@/components/calendar/helpers";
import type { Shift } from "@/lib/data.d";
import type { TCalendarView } from "@/components/calendar/types";
import { useTranslation } from "next-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

interface IProps {
	view: TCalendarView;
	events: Shift[];
}

export function DateNavigator({ view, events }: IProps) {
	const { t, i18n } = useTranslation();
	const { selectedDate, setSelectedDate } = useCalendar();
	const month = selectedDate.toLocaleDateString(i18n.language, {
		month: "short",
	}).replace(/^./, char => char.toUpperCase());

	const year = selectedDate.getFullYear();
	const todaysMonth = new Date().getMonth();
	const eventCount = useMemo(() => getEventsCount(events, selectedDate, view), [events, selectedDate, view]);

	const handlePrevious = () => setSelectedDate(navigateDate(selectedDate, view, "previous"));
	const handleNext = () => setSelectedDate(navigateDate(selectedDate, view, "next"));

	return (
		<div className="space-y-0.5">
			<div className="flex items-center gap-2">
        <span className="text-lg font-semibold">
          {month} {year}
        </span>
				<Badge variant="outline" className="px-1.5 border-gray-500">
					{eventCount} {t("calendar.shifts")}
				</Badge>
			</div>

			<div className="flex items-center gap-2">
				<Button variant="outline" disabled={todaysMonth == selectedDate.getMonth()}
						size={"xs"}
						className="size-6.5 px-0 [&_svg]:size-4.5 border-gray-500" onClick={handlePrevious}>
					<FontAwesomeIcon icon={faChevronLeft} />
				</Button>

				<p className="text-sm text-muted-foreground">{rangeText(view, selectedDate)} {todaysMonth < selectedDate.getMonth() && t("shifts.preview")} </p>

				<Button variant="outline" disabled={todaysMonth < selectedDate.getMonth()}
						size={"xs"}
						className="size-6.5 px-0 [&_svg]:size-4.5 border-gray-500" onClick={handleNext}>
					<FontAwesomeIcon icon={faChevronRight} />
				</Button>
			</div>
		</div>
	);
}

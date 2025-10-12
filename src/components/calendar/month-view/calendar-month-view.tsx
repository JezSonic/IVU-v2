import { useMemo } from "react";
import { useCalendar } from "@/context/calendar-context";
import { DayCell } from "@/components/calendar/month-view/day-cell";
import { calculateMonthEventPositions, getCalendarCells } from "@/components/calendar/helpers";
import type { Shift } from "@/lib/data.d";
import { useTranslation } from "next-i18next";
interface IProps {
	singleDayEvents: Shift[];
	multiDayEvents: Shift[];
}

export function CalendarMonthView({ singleDayEvents, multiDayEvents }: IProps) {
	const { i18n } = useTranslation();
	let week_days = [];
	for (let d = new Date(2023, 5, 12), i = 7; i; --i) {
		week_days.push(d.toLocaleString(i18n.language, { weekday: 'short' }).replace(/^./, char => char.toUpperCase()));
		d.setDate(d.getDate() + 1);
	}
	const { selectedDate } = useCalendar();
	const allEvents = [...multiDayEvents, ...singleDayEvents];
	const cells = useMemo(() => getCalendarCells(selectedDate), [selectedDate]);
	const eventPositions = useMemo(
		() => calculateMonthEventPositions(multiDayEvents, singleDayEvents, selectedDate),
		[multiDayEvents, singleDayEvents, selectedDate]
	);

	return (
		<div>
			<div className="grid grid-cols-7">
				{week_days.map(day => (
					<div key={day} className="flex items-center justify-center py-2 not-first:border-l border-gray-500">
						<span className="text-xs font-medium text-muted-foreground">{day}</span>
					</div>
				))}
			</div>

			<div className="grid grid-cols-7 overflow-hidden">
				{cells.map(cell => (
					<DayCell key={cell.date.toISOString()} cell={cell} events={allEvents}
							 eventPositions={eventPositions}/>
				))}
			</div>
		</div>
	);
}

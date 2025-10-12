import { useMemo } from "react";
import { isToday, startOfDay } from "date-fns";
import { EventBullet } from "@/components/calendar/month-view/event-bullet";
import { MonthEventBadge } from "@/components/calendar/month-view/month-event-badge";
import { cn } from "@/lib/utils";
import { getMonthCellEvents } from "@/components/calendar/helpers";
import type { Shift } from "@/lib/data.d";
import type { ICalendarCell } from "@/components/calendar/interfaces";
interface IProps {
	cell: ICalendarCell;
	events: Shift[];
	eventPositions: Record<string, number>;
}

const MAX_VISIBLE_EVENTS = 4;

export function DayCell({ cell, events, eventPositions }: IProps) {
	const { day, currentMonth, date } = cell;

	const cellEvents = useMemo(() => getMonthCellEvents(date, events, eventPositions), [date, events, eventPositions]);
	const isSunday = date.getDay() === 0;

	return (
		<div
			className={cn("flex h-full flex-col gap-1 border-l border-t border-gray-500 py-1.5 lg:py-2", isSunday && "border-l-0")}>
        <span
			className={cn(
				"h-6 px-1 text-xs font-semibold lg:px-2",
				!currentMonth && "opacity-20",
				isToday(date) && "flex w-6 translate-x-1 items-center justify-center rounded-full bg-primary px-0 font-bold text-primary-foreground"
			)}
		>
          {day}
        </span>

			<div
				className={cn("flex gap-3 px-0 h-28 flex-col", !currentMonth && "opacity-50")}>
				{[0, 1].map(position => {
					const event = cellEvents.find(e => e.position === position);
					const eventKey = event ? `event-${event.id}-${position}` : `empty-${position}`;
					return (
						<div key={eventKey} className="w-full min-h-min">
							{event && (
								<>
									<EventBullet className="lg:hidden" color={event.color}/>
									<MonthEventBadge className="hidden lg:flex" event={event}
													 cellDate={startOfDay(date)}/>
								</>
							)}
						</div>
					);
				})}
			</div>

			{cellEvents.length > MAX_VISIBLE_EVENTS && (
				<p className={cn("h-4.5 px-1.5 text-xs font-semibold text-muted-foreground", !currentMonth && "opacity-50")}>
					<span className="sm:hidden">+{cellEvents.length - MAX_VISIBLE_EVENTS}</span>
					<span className="hidden sm:inline"> {cellEvents.length - MAX_VISIBLE_EVENTS} more...</span>
				</p>
			)}
		</div>
	);
}

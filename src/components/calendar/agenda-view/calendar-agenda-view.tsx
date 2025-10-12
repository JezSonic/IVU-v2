import { useMemo } from "react";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { format, endOfDay, startOfDay, isSameMonth } from "date-fns";
import { useCalendar } from "@/context/calendar-context";
import { AgendaDayGroup } from "@/components/calendar/agenda-view/agenda-day-group";
import type { Shift } from "@/lib/data.d";
import { useTranslation } from "next-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IProps {
  singleDayEvents: Shift[];
  multiDayEvents: Shift[];
}

export function CalendarAgendaView({ singleDayEvents, multiDayEvents }: IProps) {
  const { selectedDate } = useCalendar();
	const { i18n } = useTranslation();
  const eventsByDay = useMemo(() => {
    const allDates = new Map<string, { date: Date; events: Shift[]; multiDayEvents: Shift[] }>();

    singleDayEvents.forEach(event => {
      const eventDate = event.startDate;
      if (!isSameMonth(eventDate, selectedDate)) return;

      const dateKey = eventDate.toLocaleDateString(i18n.language, {
		  year: "numeric",
		  month: "numeric",
		  day: "numeric",
	  });

      if (!allDates.has(dateKey)) {
        allDates.set(dateKey, { date: startOfDay(eventDate), events: [], multiDayEvents: [] });
      }

      allDates.get(dateKey)?.events.push(event);
    });

    multiDayEvents.forEach(event => {
      const eventStart = event.startDate;
      const eventEnd = event.endDate;

      let currentDate = startOfDay(eventStart);
      const lastDate = endOfDay(eventEnd);

      while (currentDate <= lastDate) {
        if (isSameMonth(currentDate, selectedDate)) {
          const dateKey = currentDate.toLocaleDateString(i18n.language, {
			  year: "numeric",
			  month: "numeric",
			  day: "numeric",
		  });

          if (!allDates.has(dateKey)) {
            allDates.set(dateKey, { date: new Date(currentDate), events: [], multiDayEvents: [] });
          }

          allDates.get(dateKey)?.multiDayEvents.push(event);
        }
        currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
      }
    });

    return Array.from(allDates.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [singleDayEvents, multiDayEvents, selectedDate, i18n.language]);

  const hasAnyEvents = singleDayEvents.length > 0 || multiDayEvents.length > 0;

  return (
    <div className="h-max">
		<div className="space-y-6 p-4">
			{eventsByDay.map(dayGroup => (
				<AgendaDayGroup key={dayGroup.date.toLocaleDateString(i18n.language, {
					year: "numeric",
					month: "numeric",
					day: "numeric",
				})} date={dayGroup.date} events={dayGroup.events} multiDayEvents={dayGroup.multiDayEvents} />
			))}

			{!hasAnyEvents && (
				<div className="flex flex-col items-center justify-center gap-2 py-20 text-muted-foreground">
					<FontAwesomeIcon icon={faCalendar} className={"size-10"} />
					<p className="text-sm md:text-base">No shifts scheduled for the selected month</p>
				</div>
			)}
		</div>
    </div>
  );
}

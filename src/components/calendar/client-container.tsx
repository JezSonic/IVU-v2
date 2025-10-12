"use client";

import { useMemo } from "react";
import { isSameDay } from "date-fns";
import { useCalendar } from "@/context/calendar-context";
import { CalendarHeader } from "@/components/calendar/header/calendar-header";
import { CalendarMonthView } from "@/components/calendar/month-view/calendar-month-view";
import { CalendarAgendaView } from "@/components/calendar/agenda-view/calendar-agenda-view";
import type { TCalendarView } from "@/components/calendar/types";

interface IProps {
  view: TCalendarView;
}

export function ClientContainer({ view }: IProps) {
  const { selectedDate, selectedUserId, events } = useCalendar();

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const eventStartDate = event.startDate
      const eventEndDate = event.endDate

      if (view === "month" || view === "agenda") {
        const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999);
        const isInSelectedMonth = eventStartDate <= monthEnd && eventEndDate >= monthStart;
        const isUserMatch = selectedUserId === "all";
        return isInSelectedMonth && isUserMatch;
      }
    });
  }, [selectedDate, selectedUserId, events, view]);

  const singleDayEvents = filteredEvents.filter(event => {
    const startDate = event.startDate
    const endDate = event.endDate
    return isSameDay(startDate, endDate);
  });

  const multiDayEvents = filteredEvents.filter(event => {
    const startDate = event.startDate
    const endDate = event.endDate
    return !isSameDay(startDate, endDate);
  });
  return (
    <div className="overflow-hidden rounded-xl border border-gray-700 bg-surface">
      <CalendarHeader view={view} events={filteredEvents} />
		{view === "month" && <CalendarMonthView singleDayEvents={singleDayEvents} multiDayEvents={multiDayEvents} />}
		{view === "agenda" && <CalendarAgendaView singleDayEvents={singleDayEvents} multiDayEvents={multiDayEvents} />}
    </div>
  );
}

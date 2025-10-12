import { TodayButton } from "@/components/calendar/header/today-button";
import { DateNavigator } from "@/components/calendar/header/date-navigator";
import type { Shift } from "@/lib/data.d";
import type { TCalendarView } from "@/components/calendar/types";

interface IProps {
  view: TCalendarView;
  events: Shift[];
}

export function CalendarHeader({ view, events }: IProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-gray-500 p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <TodayButton />
        <DateNavigator view={view} events={events} />
      </div>
    </div>
  );
}

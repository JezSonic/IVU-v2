import { differenceInDays, startOfDay } from "date-fns";
import { Shift } from "@/lib/data.d";
import { AgendaEventCard } from "@/components/calendar/agenda-view/agenda-event-card";
import { useTranslation } from "next-i18next";

interface IProps {
	date: Date;
	events: Shift[];
	multiDayEvents: Shift[];
}

export function AgendaDayGroup({ date, events, multiDayEvents }: IProps) {
	const sortedEvents = [...events].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
	const { i18n } = useTranslation();
	return (
		<div className="space-y-4">
			<div className="sticky top-0 flex items-center gap-4 py-2">
				<p className="text-sm font-semibold">{date.toLocaleDateString(i18n.language, {
					year: "numeric",
					month: "long",
					day: "2-digit",
					weekday: "long"
				}).replace(/^./, char => char.toUpperCase())}</p>
			</div>

			<div className="space-y-2">
				{multiDayEvents.length > 0 &&
					multiDayEvents.map(event => {
						const eventStart = startOfDay(event.startDate);
						const eventEnd = startOfDay(event.endDate);
						const currentDate = startOfDay(date);

						const eventTotalDays = differenceInDays(eventEnd, eventStart) + 1;
						const eventCurrentDay = differenceInDays(currentDate, eventStart) + 1;
						return <AgendaEventCard key={event.id} event={event} eventCurrentDay={eventCurrentDay}
												eventTotalDays={eventTotalDays}/>;
					})}

				{sortedEvents.length > 0 && sortedEvents.map(event => <AgendaEventCard key={event.id} event={event}/>)}
			</div>
		</div>
	);
}

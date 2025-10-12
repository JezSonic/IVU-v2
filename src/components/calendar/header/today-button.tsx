import { useCalendar } from "@/context/calendar-context";
import { useTranslation } from "next-i18next";

export function TodayButton() {
	const { setSelectedDate } = useCalendar();
	const { i18n } = useTranslation();
	const today = new Date();
	const handleClick = () => setSelectedDate(today);

	return (
		<button
			className="flex size-14 flex-col items-start overflow-hidden rounded-lg border border-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
			onClick={handleClick}
		>
			<p className="flex h-6 w-full items-center justify-center bg-primary text-center text-xs font-semibold text-primary-foreground">
				{today.toLocaleDateString(i18n.language, {
					month: "short",
				}).replace(/^./, char => char.toUpperCase())}
			</p>
			<p className="flex w-full items-center justify-center text-lg font-bold">{today.getDate()}</p>
		</button>
	);
}

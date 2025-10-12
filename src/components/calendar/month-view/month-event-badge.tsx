import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { endOfDay, isSameDay, startOfDay } from "date-fns";
import { useCalendar } from "@/context/calendar-context";
import { cn } from "@/lib/utils";
import type { Shift } from "@/lib/data.d";
import React from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/navigation";

const eventBadgeVariants = cva(
	"mx-1 min-h-8 cursor-pointer flex flex-col size-auto select-none justify-between gap-1.5 truncate whitespace-nowrap rounded-md border p-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
	{
		variants: {
			color: {
				// Colored and mixed variants
				blue: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300 [&_.event-dot]:fill-blue-600",
				green: "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300 [&_.event-dot]:fill-green-600",
				red: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300 [&_.event-dot]:fill-red-600",
				yellow: "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300 [&_.event-dot]:fill-yellow-600",
				purple: "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300 [&_.event-dot]:fill-purple-600",
				orange: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300 [&_.event-dot]:fill-orange-600",
				gray: "border-neutral-200 bg-neutral-50 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 [&_.event-dot]:fill-neutral-600",

				// Dot variants
				"blue-dot": "bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-blue-600",
				"green-dot": "bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-green-600",
				"red-dot": "bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-red-600",
				"yellow-dot": "bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-yellow-600",
				"purple-dot": "bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-purple-600",
				"orange-dot": "bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-orange-600",
				"gray-dot": "bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-neutral-600",
			},
			multiDayPosition: {
				first: "relative z-10 mr-0 w-[calc(100%_-_3px)] rounded-r-none border-r-0 [&>span]:mr-2.5",
				middle: "relative z-10 mx-0 w-[calc(100%_+_1px)] rounded-none border-x-0",
				last: "ml-0 rounded-l-none border-l-0",
				none: "",
			},
		},
		defaultVariants: {
			color: "blue-dot",
		},
	}
);

interface IProps extends Omit<VariantProps<typeof eventBadgeVariants>, "color" | "multiDayPosition"> {
	event: Shift;
	cellDate: Date;
	eventCurrentDay?: number;
	eventTotalDays?: number;
	className?: string;
	position?: "first" | "middle" | "last" | "none";
}

export function MonthEventBadge({event, cellDate, eventCurrentDay, eventTotalDays, className, position: propPosition}: IProps) {
	const router = useRouter();
	const { badgeVariant } = useCalendar();
	const { t, i18n } = useTranslation();
	const itemStart = startOfDay(event.startDate);
	const itemEnd = endOfDay(event.endDate);

	// Skip rendering if this day is outside the event span
	if (cellDate < itemStart || cellDate > itemEnd) return null;

	let position: "first" | "middle" | "last" | "none" | undefined;

	if (propPosition) {
		position = propPosition;
	} else if (eventCurrentDay && eventTotalDays) {
		// If explicit day counters are provided, still determine multi-day position based on dates
		if (isSameDay(itemStart, itemEnd)) {
			position = "none";
		} else if (isSameDay(cellDate, itemStart)) {
			position = "first";
		} else if (isSameDay(cellDate, itemEnd)) {
			position = "last";
		} else {
			position = "middle";
		}
	} else if (isSameDay(itemStart, itemEnd)) {
		position = "none";
	} else if (isSameDay(cellDate, itemStart)) {
		position = "first";
	} else if (isSameDay(cellDate, itemEnd)) {
		position = "last";
	} else {
		position = "middle";
	}

	// Render text for first, last and single-day (none) segments; hide on middle segments
	const renderBadgeText = ["first", "last", "none"].includes(position);

	const color = (badgeVariant === "dot" ? `${event.color}-dot` : event.color) as VariantProps<typeof eventBadgeVariants>["color"];

	const eventBadgeClasses = cn(eventBadgeVariants({ color, multiDayPosition: position, className }));

	// Compute the per-cell slice times to display correct range on each day
	const sliceStart = cellDate < event.startDate ? event.startDate : new Date(cellDate);
	const sliceEndCandidate = endOfDay(cellDate);
	const sliceEnd = sliceEndCandidate > event.endDate ? event.endDate : sliceEndCandidate;

	const daysOf = () => {
		// Compute day counters if not provided
		let current = eventCurrentDay;
		let total = eventTotalDays;
		if (!current || !total) {
			const startDay = startOfDay(event.startDate);
			const endDay = startOfDay(event.endDate);
			// differenceInCalendarDays alternative without importing: compute by ms
			const msPerDay = 24 * 60 * 60 * 1000;
			total = Math.floor((endDay.getTime() - startDay.getTime()) / msPerDay) + 1;
			current = Math.floor((startOfDay(cellDate).getTime() - startDay.getTime()) / msPerDay) + 1;
		}
		return (
			<p className="flex-1 truncate font-semibold">
				{total > 1 && current > 0 && (
					<span className="text-xs">
						{t("calendar.day_of", {
							current: current,
							total: total
						})}
					  </span>
				)}
				{event.id}
			</p>
		)
	}

	const fromTo = () => {
		return (
			<div>
				<span>{
					sliceStart.toLocaleTimeString(i18n.language, {
						hour: "2-digit",
						minute: "2-digit"
					})
				}</span> {t("calendar.to")} <span>{
					sliceEnd.toLocaleTimeString(i18n.language, {
						hour: "2-digit",
						minute: "2-digit"
					})
				}</span>
			</div>
		)
	}

	return (
		<div role="button" tabIndex={0} className={eventBadgeClasses} onClick={() => router.push(`shifts?id=${event.id}`)}>
			<div className="flex items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5 truncate">
					{!["middle", "last"].includes(position) && ["mixed", "dot"].includes(badgeVariant) && (
						<svg width="8" height="8" viewBox="0 0 8 8" className="event-dot shrink-0">
							<circle cx="4" cy="4" r="4"/>
						</svg>
					)}
					{renderBadgeText && daysOf()}
				</div>

				{renderBadgeText && fromTo()}
			</div>
			<div className="flex items-center gap-1 5 truncate">
				<p>{event.from} {t("calendar.to")} {event.to}</p>
			</div>
		</div>
	);
}

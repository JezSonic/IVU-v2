"use client";
import { useCalendar } from "@/context/calendar-context";
import type { Shift } from "@/lib/data.d";
import React from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

interface IProps {
	event: Shift;
	eventCurrentDay?: number;
	eventTotalDays?: number;
}

const _base = "flex select-none items-center justify-between gap-3 rounded-md border p-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
const _colors: {[index: string]:string}  = {
		"blue": "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300 [&_.event-dot]:fill-blue-600",
		"green": "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300 [&_.event-dot]:fill-green-600",
		"red": "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300 [&_.event-dot]:fill-red-600",
		"yellow": "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300 [&_.event-dot]:fill-yellow-600",
		"purple": "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300 [&_.event-dot]:fill-purple-600",
		"orange": "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300 [&_.event-dot]:fill-orange-600",
		"gray": "border-neutral-200 bg-neutral-50 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 [&_.event-dot]:fill-neutral-600",

		// Dot variants
		"blue-dot": "bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-blue-600",
		"green-dot": "bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-green-600",
		"red-dot": "bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-red-600",
		"orange-dot": "bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-orange-600",
		"purple-dot": "bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-purple-600",
		"yellow-dot": "bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-yellow-600",
		"gray-dot": "bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-neutral-600",
}

export function AgendaEventCard({ event, eventCurrentDay, eventTotalDays }: IProps) {
	const router = useRouter()
	const { badgeVariant } = useCalendar();

	const startDate = event.startDate;
	const endDate = event.endDate;
	const { t, i18n } = useTranslation();
	const color = (badgeVariant === "dot" ? `${event.color}-dot` : event.color);

	const agendaEventCardClasses = `${_base} ${_colors[color]}`;

	return (
		<div role="button" tabIndex={0} className={agendaEventCardClasses} onClick={() => router.push(`shifts?id=${event.id}`)}>
			<div className="flex flex-col gap-2">
				<div className="flex items-center gap-1.5">
					{["mixed", "dot"].includes(badgeVariant) && (
						<svg width="8" height="8" viewBox="0 0 8 8" className="event-dot shrink-0">
							<circle cx="4" cy="4" r="4"/>
						</svg>
					)}

					<p className="font-medium">
						{eventCurrentDay && eventTotalDays && (
							<span className="text-xs">
								  {t("calendar.day_of", {
									  current: eventCurrentDay,
									  total: eventTotalDays
								  })}
								</span>
						)}
						{event.id}
					</p>
				</div>

				<div className="flex items-center gap-1 align-baseline">
					<FontAwesomeIcon icon={faClock} className="size-4 shrink-0"/>
					<p className="text-xs text-foreground">
						{
							startDate.toLocaleTimeString(i18n.language, {
								hour: "2-digit",
								minute: "2-digit"
							})
						} {t("calendar.to")} {
						endDate.toLocaleTimeString(i18n.language, {
							hour: "2-digit",
							minute: "2-digit"
						})
					}
					</p>
				</div>

				<div className="flex items-center gap-1">
					<p className="text-xs text-foreground">{event.from} {t("calendar.to")} {event.to}</p>
				</div>
			</div>
		</div>
	);
}

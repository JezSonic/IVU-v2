import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatTime = (d: Date, locale: string|undefined = undefined) => d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
export const formatDate = (d: Date, locale: string|undefined = undefined) => d.toLocaleDateString(locale);
export const getDuration = (from?: Date, to?: Date) => {
	if (!from || !to) return "";
	const ms = Math.max(0, to.getTime() - from.getTime());
	const h = Math.floor(ms / 3600000);
	const m = Math.round((ms % 3600000) / 60000);
	return `${h}h ${m}m`;
};

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Paginated } from "@/lib/helpers/app";

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

export const paginate = <T>(array: T[], page_size: number = 5, page_number: number = 1): Paginated<T[]> =>  {
	// human-readable page numbers usually start with 1, so we reduce 1 in the first argument
	return {
		page: page_number,
		data: array.slice((page_number - 1) * page_size, page_number * page_size),
		all_pages: Math.ceil(array.length / page_size),
	}
}
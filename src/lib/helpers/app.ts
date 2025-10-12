import { ThemeMode, UiLanguage } from "@/stores/settingsStore";
import config from "@/../config"
import changelog from "../changelog.json"
export interface Config {
	available_languages: UiLanguage[]
	available_themes: ThemeMode[]
}

export interface Changelog {
	[version: string]: {
		description: string;
		added: string[];
		fixed: string[];
		removed: string[];
		date: number;
	}
}
export interface Paginated<T> {
	page: number;
	all_pages: number;
	data: T
}

/**
 * Gets an environment variable with type-safety and coercion.
 * The type (string, number, boolean, or array) is inferred
 * from the default value.
 *
 * @param key The key of the environment variable.
 * This value is ALSO used to determine the return type.
 * @returns The environment variable's value (coerced to the type of defaultValue)
 * or the default value itself.
 */
export function env<T>(key: keyof Config): T {
	return config[key] as T;
}

export function getChangelog(page: number = 1, resultsPerPage: number = 5): Paginated<Changelog> {
	let data: Changelog = {};
	const offset = (page > 1) ? (resultsPerPage * (page - 1)) : 0
	const changelogKeys: string[] = Object.keys(changelog)
	const versionsToDisplay = changelogKeys.slice(offset, offset + resultsPerPage);
	for (const versionsToDisplayKey in changelog) {
		// @ts-ignore
		if (changelogKeys[versionsToDisplayKey] !== null && versionsToDisplay.includes(versionsToDisplayKey)) {
			// @ts-ignore
			data[versionsToDisplayKey] = changelog[versionsToDisplayKey];
		}
	}

	return {
		all_pages: Math.ceil(changelogKeys.length / resultsPerPage),
		page: page,
		data: data
	}

	// return JSON.stringify(changelog)
}
export const getLatestVersion = () => {
	return Object.keys(changelog)[0];
};
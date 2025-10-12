import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import type { TEventColor } from "@/calendar/types";

export type CrewMemberRole = "conductor" | "head_conductor" | "train_driver" | "second_train_driver"

/**
 * @interface CrewData
 * @internal
 */
export interface CrewData {
	role: CrewMemberRole;
	name: string;
	gender: string;
	/**
	 * @type string
	 * Company's iternal section the crew member is assigned to
	 */
	section: string;

	/**
	 * @type string
	 * Declares on which station this crew member enters the train and starts their shift onboard on specified train
	 */
	fromStation: string;

	/**
	 * @type string
	 * Declares on which station this crew member leaves the train
	 */
	toStation: string;
}

export type CrewRole = "train_driver" | "train_driver_helper";

/**
 * Defines the possible categories of the train or activity,
 * merging the constraints requested for the 'Typ' fields.
 */
export type OperationType =
	| "passenger_train"
	| "administration"
	| "shunting"
	| "vehicle_returning"
	| "vehicle_receiving";


export type ShiftType =
	| "shift_start"
	| "shift_end"

/**
 * A single operation that belongs to a Shift's detailed timeline
 */
export interface ShiftOperation {
	type: OperationType;
	crew: CrewRole;
	shiftType?: ShiftType; // e.g., "Shift start" | "Shift end" for Administration
	trainNumber?: number; // e.g., 8306 or 56
	fromStation: string;
	startTime: Date;
	toStation: string;
	endTime: Date;
	vehicleType: string; // e.g., EU160, EU44 or "-"
}

/**
 * A whole-day (or multi-hour) shift block shown as a single calendar event.
 * Contains summary info and the full detailed list of operations.
 */
export interface Shift {
	id: string; // e.g., MKR218 or generated
	startDate: Date;
	endDate: Date;
	from: string; // summary origin (first operation fromStation)
	to: string; // summary destination (last operation toStation)
	location: string; // e.g., start location for display
	type: string; // Day Shift | Night Shift etc.
	depot: string;
	crewType: CrewRole; // e.g., "Train driver"
	color: TEventColor;
	crewDetails?: CrewData[];
	operations: ShiftOperation[]; // full timeline for details view
}

export interface SidebarLink {
	href: string;
	label: string;
	icon: IconDefinition;
}

export interface TrainData {
	number: number;
	name: string;
	type: TrainType;
	crewDetails: CrewData[];
	startDate: Date;
	endDate: Date;
	startStation: string;
	endStation: string;
	assignedLoco?: string;
}

export type TrainType = "TLK" | "IC" | "EIC" | "EIP" | "EC" | "EN"

export interface DriverLicenseEntry {
	category: string; // e.g., "EU07", "EN76"
	validUntil?: string; // ISO date string
}

export type DriverProfileRole = "train_driver" | "head_conductor" | "conductor"

export interface DriverProfile {
	name: string;
	employeeId: string;
	role: DriverProfileRole;
	section: string; // e.g., "Katowice"
	yearsOfService: number;
	phone?: string;
	email?: string;
	address?: string;
	licenses: DriverLicenseEntry[];
	avatarUrl?: string;
}

type AlertMeta = "location" | "train" | "region" | "version" | "time_window" | "applies_to"

export interface Alert {
	id: string;
	title: string;
	description: string;
	severity: "success" | "warning" | "error" | "info";
	timestamp: number;
	meta?: Partial<Record<AlertMeta, string>>;
}

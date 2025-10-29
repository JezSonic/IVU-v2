import { type Alert, CrewData, DriverProfile, Shift, ShiftOperation, TrainData, type TrainType } from "./data.d";

// Generate dummy shifts following constraints:
// - Multiple shifts can exist within a 12-hour work block, but total time (active segments + breaks) ≤ 12h
// - After each work block, there is a rest period of at least 12 hours
// - Work blocks model a driver doing 2–3 consecutive shifts (legs) starting in Katowice,
//   first leg ends in one of: Łódź, Warszawa, Kutno, Płock, Poznań,
//   then the next leg either returns to Katowice or continues to another city and the final leg returns to Katowice.

// Deterministic PRNG to avoid SSR/CSR hydration mismatches
function mulberry32(seed: number) {
	let t = seed >>> 0;
	return function () {
		t += 0x6D2B79F5;
		let r = Math.imul(t ^ (t >>> 15), 1 | t);
		r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
		return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
	};
}

// Use a fixed seed for demo data so server and client generate identical sequences
const rand = mulberry32(11111);

function addHours(date: Date, hours: number): Date {
	return new Date(date.getTime() + hours * 3600000);
}

function randomInt(min: number, max: number): number {
	return Math.floor(rand() * (max - min + 1)) + min;
}

function makeCrew(): CrewData[] {
	return [
		{
			role: "train_driver",
			name: "John Doe",
			section: "Katowice",
			gender: "Male",
			fromStation: "Katowice",
			toStation: "Katowice"
		},
		{
			role: "head_conductor",
			name: "Jane Smith",
			section: "Katowice",
			gender: "Female",
			fromStation: "Katowice",
			toStation: "Katowice"
		},
	];
}

function makeShift(
	idNum: number,
	start: Date,
	end: Date,
	fromCity: string,
	toCity: string,
	operations: Shift["operations"],
): Shift {
	const isNight = start.getHours() >= 18 || start.getHours() < 6;
	const colors: Shift["color"][] = ["yellow", "blue", "green", "purple", "orange"];
	return {
		id: `KTW-${idNum.toString().padStart(6, "0")}`,
		startDate: start,
		endDate: end,
		location: fromCity,
		type: isNight ? "Night Shift" : "Day Shift",
		from: fromCity,
		to: toCity,
		depot: "Katowice Drużyny Trakcyjne",
		crewType: "train_driver",
		color: colors[idNum % colors.length],
		crewDetails: makeCrew(),
		operations,
	};
}

function generateShifts(startFrom: Date, days: number): Shift[] {
	const result: Shift[] = [];
	let idNum = 1;
	let cursor = new Date(startFrom);
	const endBy = addHours(startFrom, days * 24);

	const cities = ["Katowice Osobowe", "Łódź Fabryczna", "Warszawa Centralna", "Kutno", "Płock", "Poznań Główny", "Wrocław Główny", "Kraków Główny", "Kraków Płaszów", "Przemyśl Bakończyce", "Rzeszów Główny", "Dębica"];

	function randomCity(exclude: string[] = []): string {
		const pool = cities.filter(c => !exclude.includes(c) && c !== "Katowice");
		return pool[Math.floor(rand() * pool.length)] ?? "Łódź";
	}

	while (cursor < endBy) {
		// Create a 12-hour work block consisting of 2–3 segments chained across cities
		const segments = randomInt(2, 3);
		let timeBudget = 12; // hours including breaks
		let segmentStart = new Date(cursor);

		// Build city chain: KTW -> X -> (KTW | Y) -> KTW
		const chain: string[] = ["Katowice"]; // start
		const firstLegTo = randomCity();
		chain.push(firstLegTo);
		if (segments === 2) {
			chain.push("Katowice");
		} else {
			// 3 segments: decide if middle returns to KTW or goes to another city
			const middleToKt = rand() < 0.5;
			if (middleToKt) {
				chain.push("Katowice");
				chain.push(randomCity());
				// ensure final returns to Katowice
				chain.push("Katowice");
				// This would create 4 entries (3 legs). We'll trim to 4 entries.
			} else {
				const secondCity = randomCity([firstLegTo]);
				chain.push(secondCity);
				chain.push("Katowice");
			}
		}
		// Ensure chain has segments+1 entries
		while (chain.length > segments + 1) chain.pop();
		while (chain.length < segments + 1) chain.push("Katowice");

		// Build operations timeline
		const operations: Shift["operations"] = [];
		const fmt = (d: Date) => d.toTimeString().slice(0, 5);
		// Administration - Shift start (5 minutes)
		const adminStartEnd = addHours(segmentStart, 5 / 60);
		operations.push({
			type: "administration",
			crew: "train_driver",
			shiftType: "shift_start",
			fromStation: chain[0],
			startTime: segmentStart,
			toStation: chain[0],
			endTime: adminStartEnd,
			vehicleType: "—",
		});

		let currentStart = new Date(adminStartEnd);
		for (let i = 0; i < segments; i++) {
			// Ensure at least 1h duration; up to 5h typical
			const maxDur = Math.min(5, timeBudget - (segments - i - 1) * 1.5 - 0.5); // leave space for breaks and min next segment
			const minDur = 1; // hours
			if (maxDur <= minDur) break;
			const dur = Math.max(minDur, Math.min(maxDur, randomInt(2, 4)));
			const segmentEnd = addHours(currentStart, dur);
			const fromCity = chain[i];
			const toCity = chain[i + 1];
			operations.push({
				type: "passenger_train",
				crew: "train_driver",
				trainNumber: 1000 + randomInt(0, 99999),
				fromStation: fromCity,
				startTime: currentStart,
				toStation: toCity,
				endTime: segmentEnd,
				vehicleType: rand() < 0.5 ? "EU160" : "EU44",
			});
			timeBudget -= dur;

			// add a break before next segment if any
			if (i < segments - 1 && timeBudget > 0.5) {
				const maxBreak = Math.min(2, timeBudget - (segments - i - 1) * 1);
				const br = Math.max(0.5, Math.min(maxBreak, randomInt(1, 2)));
				const breakEnd = addHours(segmentEnd, br);
				// add a small operation to represent vehicle return/receiving randomly
				operations.push({
					type: rand() < 0.5 ? "vehicle_returning" : "vehicle_receiving",
					crew: "train_driver",
					fromStation: toCity,
					startTime: segmentEnd,
					toStation: toCity,
					endTime: breakEnd,
					vehicleType: "—",
				});
				currentStart = new Date(breakEnd);
				timeBudget -= br;
			} else {
				currentStart = new Date(segmentEnd);
			}
		}

		// Administration - Shift end (5 minutes)
		const shiftEndStart = new Date(currentStart);
		const shiftEndEnd = addHours(shiftEndStart, 5 / 60);
		operations.push({
			type: "administration",
			crew: "train_driver",
			shiftType: "shift_end",
			fromStation: chain[chain.length - 1],
			startTime: shiftEndStart,
			toStation: chain[chain.length - 1],
			endTime: shiftEndEnd,
			vehicleType: "—",
		});

		// Create a single shift for this block
		const shiftStart = segmentStart;
		const shiftEnd = shiftEndEnd;
		const shift = makeShift(idNum++, shiftStart, shiftEnd, chain[0], chain[chain.length - 1], operations);
		result.push(shift);

		// Move cursor to after the work block end and add mandatory rest (≥ 12h)
		cursor = addHours(shiftEnd, 12 + randomInt(0, 6)); // 12–18h rest
	}
	return result;
}

export const shifts: Shift[] = generateShifts(new Date(), 28);

const generateTrainsFromShifts = (shifts: Shift[]): TrainData[] => {
	let _operations: ShiftOperation[] = [];
	for (const shift of shifts) {
		_operations = _operations.concat(shift.operations);
	}

	let _data: TrainData[] = [];
	for (const operation of _operations) {
		if (operation.trainNumber == undefined) {
			continue;
		}

		const _types: TrainType[] = ["EC", "EN", "EIP", "EIC", "IC", "TLK"];
		const _names = ["Barbakan", "Bolko", "Cegielski", "Chemik", "Chopin", "Galicja", "Górnik", "Górski", "Hańcza", "Hutnik", "Jagiełło", "Wyspiański", "Karkonosze", "Matejko", "Mazury", "Przemyślanin", "Reymont", "Mehoffer", "Wisłok", "San", "Wawel", "Witkacy", "Witos", "Ustronie", "Ślązak", "Zefir", "Łukasiewicz", "Wyczółkowski", "Włókniarz"];
		let _tmp: TrainData = {
			number: operation.trainNumber,
			name: _names[Math.floor(rand() * _names.length)],
			type: _types[Math.floor(rand() * _types.length)],
			crewDetails: makeCrew(),
			startDate: operation.startTime,
			endDate: operation.endTime,
			startStation: operation.fromStation,
			endStation: operation.toStation
		};
		_data.push(_tmp);
	}

	return _data;
};

export const trains: TrainData[] = generateTrainsFromShifts(shifts);


export const driverProfile: DriverProfile = {
	name: "John Doe",
	employeeId: "KD-102938",
	role: "train_driver",
	section: "Katowice",
	yearsOfService: 8,
	phone: "+48 600 100 200",
	email: "john.doe@example.com",
	address: "ul. Dworcowa 1, 40-001 Katowice, Polska",
	licenses: [
		{ category: "EU07" },
		{ category: "EP09" },
		{ category: "EN76" },
	],
	avatarUrl: "",
};

export const alerts = (now: Date): Alert[] => [
	{
		id: "a1",
		title: "Track maintenance near Katowice",
		description:
			"Expect minor delays on routes passing through Katowice between 12:00–16:00. Maintenance crew on site.",
		severity: "warning",
		timestamp: now.getTime() - 10 * 60 * 1000,
		meta: { location: "Katowice", time_window: "12:00–16:00" },
	}, {
		id: "a2",
		title: "System update",
		description: "New timetable data has been loaded successfully.",
		severity: "success",
		timestamp: now.getTime() - 45 * 60 * 1000,
		meta: { applies_to: "Timetable Service", version: "2025.10.16" },
	}, {
		id: "a3",
		title: "Crew change required",
		description:
			"Second train driver needed for Train 12345 after Poznań due to scheduling constraints.",
		severity: "error",
		timestamp: now.getTime() - 2 * 60 * 60 * 1000,
		meta: { train: "IC 12345", location: "Poznań" },
	}, {
		id: "a4",
		title: "Information: Weather advisory",
		description: "Strong winds expected in Silesia region from 18:00. Monitor overhead lines.",
		severity: "info",
		timestamp: now.getTime() - 3 * 60 * 60 * 1000,
		meta: { region: "Silesia", time_window: "18:00" },
	}, {
		id: "a101",
		title: "Success: Schedule Update Complete",
		description: "The latest train schedule update (Version 3.2) has been successfully deployed across all systems. No action required.",
		severity: "success",
		timestamp: now.getTime() - 10 * 60 * 1000, // 10 minutes ago
		meta: {
			version: "3.2",
			applies_to: "All Systems"
		},
	}, {
		id: "a102",
		title: "Warning: Signal Interruption Near Central Station",
		description: "Temporary signal failure reported near **Central Station**. Expect minor delays (5-10 minutes) on lines R1 and R4.",
		severity: "warning",
		timestamp: now.getTime() - 45 * 60 * 1000, // 45 minutes ago
		meta: {
			location: "Central Station",
			train: "R1, R4",
			time_window: "Immediate"
		},
	}, {
		id: "a103",
		title: "Error: System Downtime - Data Sync Failure",
		description: "Critical failure in the primary data synchronization process. Affected services are currently using cached data. Technical teams are investigating.",
		severity: "error",
		timestamp: now.getTime() - 2 * 60 * 60 * 1000, // 2 hours ago
		meta: {
			applies_to: "Data Sync Service",
			time_window: "Ongoing"
		},
	}, {
		id: "a104",
		title: "Information: Planned Maintenance Tonight",
		description: "Scheduled database maintenance will occur tonight, affecting reporting features. All operations will remain functional.",
		severity: "info",
		timestamp: now.getTime() - 12 * 60 * 60 * 1000, // 12 hours ago
		meta: {
			time_window: "23:00 - 03:00",
			applies_to: "Reporting Features"
		},
	}, {
		id: "a105",
		title: "Warning: High Wind Advisory in Coastal Region",
		description: "Due to predicted high winds, speed restrictions are imposed on all trains operating in the **Coastal Region**. Delays up to 20 minutes possible.",
		severity: "warning",
		timestamp: now.getTime() - 3 * 60 * 60 * 1000, // 3 hours ago
		meta: {
			region: "Coastal",
			train: "All",
			time_window: "Until further notice"
		},
	}, {
		id: "a106",
		title: "Information: Regional Travel Advisory",
		description: "A minor traffic accident outside the station is causing limited bus connections. Passengers traveling to the **Mazovia** region should expect small delays in surface transit.",
		severity: "info",
		timestamp: now.getTime() - 25 * 60 * 1000, // 25 minutes ago
		meta: {
			region: "Mazovia",
			applies_to: "Bus Connections"
		},
	}, {
		id: "a107",
		title: "Warning: Service Disruption on R5 Line",
		description: "The **R5 line** is experiencing a service delay of approximately 15 minutes due to an operational issue. We expect normal service to resume shortly.",
		severity: "warning",
		timestamp: now.getTime() - 60 * 60 * 1000, // 1 hour ago
		meta: {
			train: "R5",
			time_window: "Immediate"
		},
	}, {
		id: "a108",
		title: "Error: API Timeout - Train Tracking",
		description: "The live train tracking API is currently unreachable, leading to stale or missing location data in applications. Core services are unaffected.",
		severity: "error",
		timestamp: now.getTime() - 5 * 60 * 1000, // 5 minutes ago
		meta: {
			applies_to: "Train Tracking API",
			time_window: "Ongoing"
		},
	}, {
		id: "a109",
		title: "Success: New App Version Available",
		description: "A **new application version (1.1.0)** is now available with bug fixes and performance improvements. Please update for the best experience.",
		severity: "success",
		timestamp: now.getTime() - 24 * 60 * 60 * 1000, // 1 day ago
		meta: {
			version: "1.1.0",
			applies_to: "Mobile App"
		},
	},
];
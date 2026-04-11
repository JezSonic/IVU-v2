import { type Alert, CrewData, DriverProfile, Shift, ShiftOperation, TrainData, type TrainType, Vehicle } from "./data.d";

const locoPool: Vehicle[] = [
	{ id: "L1", country: "PL", operator: "PKPIC", type: "EU07", number: "085", length: 15.9, ownWeight: 80 },
	{ id: "L2", country: "PL", operator: "PKPIC", type: "EP09", number: "047", length: 16.4, ownWeight: 84 },
];

const wagonPool: Vehicle[] = [
	{ id: "W1", country: "PL", operator: "PKPIC", type: "B9nou", number: "51 51 19-70 003-4", length: 24.5, loadWeight: 5, ownWeight: 33.5 },
	{ id: "W2", country: "PL", operator: "PKPIC", type: "WRmnouz", number: "61 51 88-70 191-1", length: 26.4, loadWeight: 3, ownWeight: 53 },
	{ id: "W3", country: "PL", operator: "PKPIC", type: "B10nou", number: "51 51 20-70 829-9", length: 24.5, loadWeight: 6, ownWeight: 39.5 },
	{ id: "W4", country: "PL", operator: "PKPIC", type: "B10nou", number: "51 51 20-71102-0", length: 24.5, loadWeight: 6, ownWeight: 39.5 },
	{ id: "W5", country: "PL", operator: "PKPIC", type: "B10nou", number: "50 51 20-08 607-7", length: 24.5, loadWeight: 6, ownWeight: 39.5 },
	{ id: "W6", country: "PL", operator: "PKPIC", type: "B11gmnouz", number: "61 51 21-70 107-7", length: 26.4, loadWeight: 5, ownWeight: 52 },
	{ id: "W7", country: "PL", operator: "PKPIC", type: "B11mnouz", number: "61 51 21-70 064-0", length: 26.4, loadWeight: 5, ownWeight: 52 },
	{ id: "W8", country: "PL", operator: "PKPIC", type: "A9mnouz", number: "61 51 19-70 234-3", length: 26.4, loadWeight: 4, ownWeight: 48 },
	{ id: "W9", country: "PL", operator: "PKPIC", type: "A9emnouz", number: "61 5119-70 214-5", length: 26.4, loadWeight: 4, ownWeight: 50 },
	{ id: "W10", country: "PL", operator: "PKPIC", type: "B11mnouz", number: "61 51 21-70 098-8", length: 26.4, loadWeight: 5, ownWeight: 52 },
	{ id: "W11", country: "PL", operator: "PKPIC", type: "B10bmnouz", number: "61 51 20-71105-1", length: 26.4, loadWeight: 5, ownWeight: 50 },
	{ id: "W12", country: "PL", operator: "PKPIC", type: "B10nou", number: "50 51 20-00 608-3", length: 24.5, loadWeight: 6, ownWeight: 39.5 },
	{ id: "W13", country: "PL", operator: "PKPIC", type: "B9nou", number: "50 5119-00 189-7", length: 24.5, loadWeight: 5, ownWeight: 33.5 },
	{ id: "W14", country: "PL", operator: "PKPIC", type: "B9nou", number: "50 51 19-08 136-0", length: 24.5, loadWeight: 5, ownWeight: 33.5 },
];

const emuPool: Vehicle[] = [
	{ id: "E1", country: "PL", operator: "PKPIC", type: "ED250", number: "2 150 001-1", length: 60.4, loadWeight: 34, ownWeight: 395 },
	{ id: "E2", country: "PL", operator: "PKPIC", type: "ED160", number: "001", length: 45.5, loadWeight: 20, ownWeight: 90 },
];

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
			const isEMU = rand() < 0.4;
			const currentVehicles: Vehicle[] = [];
			if (isEMU) {
				const emu = emuPool[Math.floor(rand() * emuPool.length)];
				currentVehicles.push({ ...emu, id: "L1" });
			} else {
				const loco = locoPool[Math.floor(rand() * locoPool.length)];
				currentVehicles.push({ ...loco, id: "L1" });
				const wagonCount = randomInt(4, 9);
				const availableWagons = [...wagonPool];
				for (let j = 0; j < wagonCount && availableWagons.length > 0; j++) {
					const idx = Math.floor(rand() * availableWagons.length);
					const wagon = availableWagons.splice(idx, 1)[0];
					currentVehicles.push({ ...wagon, id: (j + 1).toString() });
				}
			}
			const totalLength = Number(currentVehicles.reduce((acc, v) => acc + v.length, 0).toFixed(1));
			const totalWeight = Number(currentVehicles.reduce((acc, v) => acc + v.ownWeight + (v.loadWeight ?? 0), 0).toFixed(1));
			const rollingStockSummary = isEMU ? `${currentVehicles[0].type} (EMU)` : `${currentVehicles[0].type}-${currentVehicles[0].number} + ${currentVehicles.length - 1} wagons`;

			operations.push({
				type: "passenger_train",
				crew: "train_driver",
				trainNumber: 1000 + randomInt(0, 99999),
				fromStation: fromCity,
				startTime: currentStart,
				toStation: toCity,
				endTime: segmentEnd,
				vehicleType: currentVehicles[0].type,
				length: totalLength,
				weight: totalWeight,
				rollingStock: rollingStockSummary,
				vehicles: currentVehicles
			});
			timeBudget -= dur;

			// add a break before next segment if any
			if (i < segments - 1 && timeBudget > 0.5) {
				const maxBreak = Math.min(2, timeBudget - (segments - i - 1));
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

		let _types: TrainType[] = ["EC", "EN", "EIP", "EIC", "IC", "TLK"];
		if (operation.vehicleType === "ED250") {
			_types = ["EIJ", "EIP"];
		} else if (operation.vehicleType === "EN76") {
			_types = ["EN", "IC"];
		} else {
			_types = ["EC", "EIC", "IC", "TLK"];
		}
		const _names = ["Barbakan", "Bolko", "Cegielski", "Chemik", "Chopin", "Galicja", "Górnik", "Górski", "Hańcza", "Hutnik", "Jagiełło", "Wyspiański", "Karkonosze", "Matejko", "Mazury", "Przemyślanin", "Reymont", "Mehoffer", "Wisłok", "San", "Wawel", "Witkacy", "Witos", "Ustronie", "Ślązak", "Zefir", "Łukasiewicz", "Wyczółkowski", "Włókniarz"];
		let _tmp: TrainData = {
			number: operation.trainNumber,
			name: _names[Math.floor(rand() * _names.length)],
			type: _types[Math.floor(rand() * _types.length)],
			crewDetails: makeCrew(),
			startDate: operation.startTime,
			endDate: operation.endTime,
			startStation: operation.fromStation,
			endStation: operation.toStation,
			length: operation.length,
			weight: operation.weight,
			rollingStock: operation.rollingStock,
			vehicles: operation.vehicles
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
		{ category: "ED250" },
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
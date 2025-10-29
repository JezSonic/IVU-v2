import { ApiService, api } from "@/services/api";
import { shifts } from "@/lib/data";
import { Shift } from "@/lib/data.d"
export interface ShiftDTO {
  id: string | number;
  startDate?: string | Date;
  endDate?: string | Date;
  [key: string]: any;
}

export class ShiftsService {
  constructor(private http: ApiService = api) {}

  list(): Promise<Shift[]> {
    return new Promise((resolve, reject) => {
		resolve(shifts)
	})
  }

  getById(id: string | number): Shift | undefined {
	  return shifts.find((a) => {return a.id == id})
  }
}

export const shiftsService = new ShiftsService();

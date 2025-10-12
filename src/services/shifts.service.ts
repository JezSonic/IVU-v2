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

  list(params?: { from?: string; to?: string; page?: number; pageSize?: number }) {
    return this.http.get<ShiftDTO[]>("/shifts", { query: params });
  }

  getById(id: string | number): Shift | undefined {
    //return this.http.get<ShiftDTO>(`/shifts/${id}`);
	  return shifts.find((a) => {return a.id == id})
  }

  create(payload: Partial<ShiftDTO>) {
    return this.http.post<ShiftDTO, Partial<ShiftDTO>>("/shifts", { body: payload });
  }

  update(id: string | number, payload: Partial<ShiftDTO>) {
    return this.http.put<ShiftDTO, Partial<ShiftDTO>>(`/shifts/${id}`, { body: payload });
  }

  delete(id: string | number) {
    return this.http.delete<void>(`/shifts/${id}`);
  }
}

export const shiftsService = new ShiftsService();

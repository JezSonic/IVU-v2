import { ApiService, api } from "@/services/api";

// Placeholder types; replace with your real API types
export interface TrainDTO {
  id: string | number;
  name?: string;
  [key: string]: any;
}

export class TrainsService {
  constructor(private http: ApiService = api) {}

  list(params?: { page?: number; pageSize?: number; search?: string }) {
    return this.http.get<TrainDTO[]>("/trains", { query: params });
  }

  getById(id: string | number) {
    return this.http.get<TrainDTO>(`/trains/${id}`);
  }

  create(payload: Partial<TrainDTO>) {
    return this.http.post<TrainDTO, Partial<TrainDTO>>("/trains", { body: payload });
  }

  update(id: string | number, payload: Partial<TrainDTO>) {
    return this.http.put<TrainDTO, Partial<TrainDTO>>(`/trains/${id}`, { body: payload });
  }

  delete(id: string | number) {
    return this.http.delete<void>(`/trains/${id}`);
  }
}

export const trainsService = new TrainsService();

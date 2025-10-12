import { ApiService, api } from "@/services/api";

export interface AlertDTO {
  id: string | number;
  type?: string;
  message?: string;
  read?: boolean;
  [key: string]: any;
}

export class AlertsService {
  constructor(private http: ApiService = api) {}

  list(params?: { unreadOnly?: boolean; page?: number; pageSize?: number }) {
    return this.http.get<AlertDTO[]>("/alerts", { query: params });
  }

  getById(id: string | number) {
    return this.http.get<AlertDTO>(`/alerts/${id}`);
  }

  markRead(id: string | number) {
    return this.http.patch<AlertDTO, Partial<AlertDTO>>(`/alerts/${id}`, { body: { read: true } });
  }

  delete(id: string | number) {
    return this.http.delete<void>(`/alerts/${id}`);
  }
}

export const alertsService = new AlertsService();

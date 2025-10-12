import { ApiService, api } from "@/services/api";

export interface SettingsDTO {
  id?: string | number;
  // add settings fields here
  [key: string]: any;
}

export class SettingsService {
  constructor(private http: ApiService = api) {}

  getAll() {
    return this.http.get<SettingsDTO>("/settings");
  }

  update(payload: Partial<SettingsDTO>) {
    return this.http.put<SettingsDTO, Partial<SettingsDTO>>("/settings", { body: payload });
  }
}

export const settingsService = new SettingsService();

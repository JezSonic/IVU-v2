import { api, ApiService } from "@/services/api";
import { alerts } from "@/lib/data";
import { Alert } from "@/lib/data.d"
import { paginate } from "@/lib/utils";
import { Paginated } from "@/lib/helpers/app";

export class AlertsService {
	constructor(private http: ApiService = api) {
	}

	list(params?: { unreadOnly?: boolean; page?: number; pageSize?: number, severity?: "success" | "warning" | "error" | "info" }) {
		const _alerts = alerts(new Date());

		if (params?.unreadOnly) {
			//@TODO: Gather unread alerts and filter them out
		}

		return new Promise<Paginated<Alert[]>>((resolve, reject) => {
			if (params?.severity) {
				resolve(paginate(_alerts.filter((a) => a.severity == params?.severity), params?.pageSize, params?.page))
			}
			resolve(paginate(_alerts, params?.pageSize, params?.page))
		})
	}

	getById(id: string | number) {
		return this.http.get<Alert>(`/alerts/${id}`);
	}

	// markRead(id: string | number) {
	// 	return this.http.patch<Alert, Partial<Alert>>(`/alerts/${id}`, { body: { read: true } });
	// }
}

export const alertsService = new AlertsService();

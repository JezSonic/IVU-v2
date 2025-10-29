import { api, ApiService } from "@/services/api";
import { driverProfile } from "@/lib/data";
import { DriverProfile } from "@/lib/data.d"

export class UserService {
	constructor(private http: ApiService = api) {}

	getData(): Promise<DriverProfile> {
		return new Promise((resolve, reject) => {
			resolve(driverProfile)
		})
	}
}

export const userService = new UserService();

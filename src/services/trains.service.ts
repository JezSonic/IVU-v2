import { ApiService, api } from "@/services/api";
import { trains } from "@/lib/data";
import { TrainData } from "@/lib/data.d";

// Placeholder types; replace with your real API types
export interface TrainDTO {
  id: string | number;
  name?: string;
  [key: string]: any;
}

export class TrainsService {
  constructor(private http: ApiService = api) {}

  list(): Promise<TrainData[]>  {
	  return new Promise<TrainData[]> ((resolve, reject) => {
		  resolve(trains)
	  })
  }

  getById(id: number): Promise<TrainData | null> {
    return new Promise<TrainData | null> ((resolve, reject) => {
		resolve(trains.find((a: TrainData) => a.number === id) || null)
	})
  }
}

export const trainsService = new TrainsService();

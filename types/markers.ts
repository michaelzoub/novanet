export interface markers {
  id: string;
  jobType: string;
  status: string;
  review: string;
  location: [number, number]; // [longitude, latitude]
  clientId?: string;
}

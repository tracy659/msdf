import { ServiceModelItem } from "../models/ServiceModel";
import { api } from "./api";

const SERVICE_API_URL = `/administration-dashboard/overview`;

export async function fetchServices(): Promise<ServiceModelItem> {
  try {
    const response = await api.get<{ result: ServiceModelItem }>(
      SERVICE_API_URL,
    );
    return response.data.result;
  } catch (error) {
    console.error("Error fetching services data:", error);
    throw error;
  }
}

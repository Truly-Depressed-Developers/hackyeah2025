import axios from "axios";
import { format } from "date-fns";
import type { EventFiltersState } from "@/components/events/EventsFilters";
import type { ApiEvent, ApiResponse } from "@/types/event";

const apiClient = axios.create({
  baseURL: "/api/proxy",
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: {
    serialize: (params) => {
      return Object.entries(params)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return value.map((v) => `${key}=${encodeURI(v)}`).join("&");
          }
          return `${key}=${encodeURI(value as string)}`;
        })
        .join("&");
    },
  },
});

export const getApiEvents = async (
  filters: EventFiltersState,
  searchTerm: string,
): Promise<ApiEvent[]> => {
  const params: Record<string, any> = {};

  if (searchTerm.trim()) params.text = searchTerm.trim();
  if (filters.location.length > 0) params.location = filters.location[0]!;
  if (filters.form.length > 0) params.form = filters.form;
  if (filters.workload.length > 0) params.workload = filters.workload;
  if (filters.dateFrom)
    params.start_date_from = format(filters.dateFrom, "yyyy-MM-dd");
  if (filters.dateTo) params.end_date_to = format(filters.dateTo, "yyyy-MM-dd");

  try {
    const response = await apiClient.get<ApiResponse>("/query", { params });
    return response.data.results;
  } catch (error) {
    console.error("Błąd podczas pobierania danych z API:", error);
    return [];
  }
};

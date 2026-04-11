import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

/**
 * Central hook — single API call to GET /api/v1/dashboard/summary.
 * The proxy route reads userId from the JWT session cookie automatically.
 * All dashboard computation hooks consume slices of this response.
 */
export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: () => api.get("/dashboard/summary"),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

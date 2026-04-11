"use client";

import { useQuery } from "@tanstack/react-query";
import { getGoalProjection } from "@/lib/assessment-api";

/**
 * Step 4: Goal Projection — fetches all goal projections, surplus, and feasibility from backend.
 */
export const useGoalProjectionQuery = () =>
    useQuery({
        queryKey: ["goal-projection"],
        queryFn: getGoalProjection,
        staleTime: 30 * 1000,
    });

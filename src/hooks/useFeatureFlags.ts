"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    fetchAdminFlags,
    fetchPublicFlags,
    updateAdminFlag,
    type FeatureFlag,
    type FeatureFlagKey,
    type FlagMap,
} from "@/lib/feature-flags";

const PUBLIC_KEY = ["feature-flags", "public"] as const;
const ADMIN_KEY = ["feature-flags", "admin"] as const;

export function useFeatureFlagsPublic() {
    return useQuery<FlagMap>({
        queryKey: PUBLIC_KEY,
        queryFn: fetchPublicFlags,
        staleTime: 60_000,
    });
}

export function useFeatureFlag(key: FeatureFlagKey): boolean {
    const { data } = useFeatureFlagsPublic();
    return data?.[key] ?? false;
}

export function useAdminFlags() {
    return useQuery<FeatureFlag[]>({
        queryKey: ADMIN_KEY,
        queryFn: fetchAdminFlags,
        staleTime: 10_000,
    });
}

export function useToggleFlag() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ key, enabled }: { key: FeatureFlagKey; enabled: boolean }) =>
            updateAdminFlag(key, enabled),
        onMutate: async ({ key, enabled }) => {
            await qc.cancelQueries({ queryKey: ADMIN_KEY });
            const prev = qc.getQueryData<FeatureFlag[]>(ADMIN_KEY);
            if (prev) {
                qc.setQueryData<FeatureFlag[]>(
                    ADMIN_KEY,
                    prev.map((f) => (f.key === key ? { ...f, enabled } : f))
                );
            }
            return { prev };
        },
        onError: (_err, _vars, ctx) => {
            if (ctx?.prev) qc.setQueryData(ADMIN_KEY, ctx.prev);
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: ADMIN_KEY });
            qc.invalidateQueries({ queryKey: PUBLIC_KEY });
        },
    });
}

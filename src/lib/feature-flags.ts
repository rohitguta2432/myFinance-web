export type FeatureFlagKey =
    | "premium_advanced_investment"
    | "premium_tax_optimizer"
    | "premium_retirement_pro"
    | "premium_export_tools"
    | "premium_kira_pro"
    | "premium_locked_insights"
    | "show_pricing"
    | "show_investments_tab"
    | "show_sebi_disclaimers"
    | "show_asset_allocation";

export type FlagMap = Partial<Record<FeatureFlagKey, boolean>>;

export interface FeatureFlag {
    key: FeatureFlagKey;
    label: string;
    description?: string;
    category: "premium" | "experimental" | "core" | "policy";
    enabled: boolean;
    updatedAt: string;
    updatedBy?: string;
}

export async function fetchPublicFlags(): Promise<FlagMap> {
    const res = await fetch("/api/proxy/feature-flags", { credentials: "include" });
    if (!res.ok) throw new Error(`feature-flags fetch failed: ${res.status}`);
    return res.json();
}

export async function fetchAdminFlags(): Promise<FeatureFlag[]> {
    const res = await fetch("/api/proxy/admin/feature-flags", { credentials: "include" });
    if (!res.ok) throw new Error(`admin feature-flags fetch failed: ${res.status}`);
    return res.json();
}

export async function updateAdminFlag(
    key: FeatureFlagKey,
    enabled: boolean
): Promise<FeatureFlag> {
    const res = await fetch(`/api/proxy/admin/feature-flags/${key}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
    });
    if (!res.ok) throw new Error(`admin feature-flag update failed: ${res.status}`);
    return res.json();
}

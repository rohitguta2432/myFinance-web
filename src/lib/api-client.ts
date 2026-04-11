const PROXY_BASE = "/api/proxy";

interface RequestOptions {
    method?: string;
    body?: unknown;
}

async function apiFetch<T = unknown>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    // endpoint examples: "/assessment/step/1/42" or "assessment/step/1/42"
    const path = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
    const url = `${PROXY_BASE}/${path}`;

    const config: RequestInit = {
        method: options.method ?? "GET",
        headers: { "Content-Type": "application/json" },
    };

    if (options.body !== undefined) {
        config.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, config);

    if (response.status === 401) {
        if (typeof window !== "undefined") {
            window.location.replace("/");
        }
        throw new Error("Session expired. Redirecting to sign-in.");
    }

    if (!response.ok) {
        const errBody = await response.json().catch(() => ({
            message: `Request failed with status ${response.status}`,
        })) as { message?: string };
        throw new Error(errBody.message ?? `API error: ${response.status}`);
    }

    const text = await response.text();
    if (!text) return null as T;
    return JSON.parse(text) as T;
}

export const api = {
    get: <T = unknown>(endpoint: string) =>
        apiFetch<T>(endpoint, { method: "GET" }),
    post: <T = unknown>(endpoint: string, data: unknown) =>
        apiFetch<T>(endpoint, { method: "POST", body: data }),
    put: <T = unknown>(endpoint: string, data: unknown) =>
        apiFetch<T>(endpoint, { method: "PUT", body: data }),
    delete: <T = unknown>(endpoint: string) =>
        apiFetch<T>(endpoint, { method: "DELETE" }),
};

export { apiFetch };

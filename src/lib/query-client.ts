import { QueryClient } from "@tanstack/react-query";

function makeQueryClient(): QueryClient {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5 * 60 * 1000, // 5 minutes — assessment data changes infrequently
                retry: 1,
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient(): QueryClient {
    if (typeof window === "undefined") {
        // Server: always create a new client to avoid sharing state between requests
        return makeQueryClient();
    }
    // Browser: reuse the singleton
    if (!browserQueryClient) {
        browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
}

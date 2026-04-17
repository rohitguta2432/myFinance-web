/**
 * Client-only utilities for scoping & wiping the assessment-storage Zustand
 * persist key per user. Required to prevent cross-user data leaks on shared
 * browsers where prior user's wizard state would otherwise autofill.
 */

export const ASSESSMENT_STORAGE_PREFIX = "assessment-storage";
export const LEGACY_ASSESSMENT_STORAGE_KEY = "assessment-storage";
export const LAST_USER_KEY = "myfinancial_last_user_id";

/**
 * Reads the logged-in user's id from the user_profile cookie.
 * Returns null on the server, when no cookie is set, or on parse failure.
 * The cookie value is URL-encoded JSON: { id: number, email, name, pictureUrl }.
 * id is coerced to string for safe use as a key suffix.
 */
export function readUserIdFromCookie(): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(/(?:^|;\s*)user_profile=([^;]+)/);
    if (!match) return null;
    try {
        const decoded = decodeURIComponent(match[1]);
        const parsed = JSON.parse(decoded);
        if (parsed && (typeof parsed.id === "number" || typeof parsed.id === "string")) {
            return String(parsed.id);
        }
        return null;
    } catch {
        return null;
    }
}

/**
 * Resolves the per-user persist key. Falls back to the legacy unscoped key
 * only when no user is logged in (anonymous wizard usage on landing page).
 */
export function resolveAssessmentStorageKey(): string {
    const userId = readUserIdFromCookie();
    return userId ? `${ASSESSMENT_STORAGE_PREFIX}-${userId}` : ASSESSMENT_STORAGE_PREFIX;
}

/**
 * Removes ALL keys starting with "assessment-storage" from localStorage.
 * Used by logout and login-mismatch flows to scrub any prior user's data.
 * Safe to call on the server (no-op).
 */
export function wipeAllAssessmentStorage(): void {
    if (typeof window === "undefined") return;
    const keysToRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith(ASSESSMENT_STORAGE_PREFIX)) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach((k) => window.localStorage.removeItem(k));
}

/**
 * One-time legacy key migration. Runs at module load BEFORE Zustand's
 * persist middleware hydrates. If the legacy unscoped key exists:
 *   - When a user is logged in: rename to assessment-storage-{userId}
 *     (preserves in-progress wizard data for current session).
 *   - When no user is logged in: delete the legacy key (no safe owner can
 *     be inferred — preventing it from leaking to whoever logs in next).
 * Idempotent: safe to run multiple times. The destination key wins on
 * collision (we do NOT overwrite an existing per-user key).
 */
export function migrateLegacyAssessmentKey(): void {
    if (typeof window === "undefined") return;
    const legacy = window.localStorage.getItem(LEGACY_ASSESSMENT_STORAGE_KEY);
    if (legacy === null) return;

    const userId = readUserIdFromCookie();
    if (userId) {
        const targetKey = `${ASSESSMENT_STORAGE_PREFIX}-${userId}`;
        // Do not clobber an existing per-user key.
        if (window.localStorage.getItem(targetKey) === null) {
            window.localStorage.setItem(targetKey, legacy);
        }
    }
    // In both branches we drop the legacy key — either we copied it, or no
    // owner can be inferred and it must not leak.
    window.localStorage.removeItem(LEGACY_ASSESSMENT_STORAGE_KEY);
}

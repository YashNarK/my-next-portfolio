// Query keys live here, deliberately free of any imports.
//
// The root layout (a Server Component) seeds the profile cache, so it needs
// this key — but importing it from the hook would drag the Firebase client SDK
// into the server module graph, where `firebase-client.ts` calls `getAuth()`
// at module scope and throws if the web config is missing. Keeping the key
// standalone means a Firebase misconfiguration can never 500 the whole site.

export const PROFILE_QUERY_KEY = ["siteConfig", "profile"] as const;

import { PostHog } from "posthog-node";

const client = new PostHog("phc_x");

export async function handler(userId: string) {
  const legacy = await client.isFeatureEnabled("server-legacy", userId);
  const flags = await client.evaluateFlags(userId);
  if (flags.isEnabled("server-snapshot")) return flags.getFlag("server-variant");
  return isEnabled("bare-generic-name"); // generic names only count as method calls
}

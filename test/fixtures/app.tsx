import { useFeatureFlagEnabled, useFeatureFlagVariantKey, PostHogFeature } from "posthog-js/react";
import posthog from "posthog-js";

export function Checkout() {
  const enabled = useFeatureFlagEnabled("new-checkout");
  const variant = useFeatureFlagVariantKey('checkout-layout');
  if (posthog.isFeatureEnabled(`promo-banner`)) {
    console.log("promo");
  }
  const payload = posthog?.getFeatureFlagPayload("checkout-config");
  const dynamic = posthog.getFeatureFlag(`exp-${variant}`);
  const fromVar = posthog.isFeatureEnabled(FLAG_NAME);
  const custom = useFlag("custom-wrapper-flag");
  const unrelated = settings.isEnabled; // not a call
  return (
    <PostHogFeature flag="beta-dashboard" match={true}>
      <div>{String(enabled)}</div>
    </PostHogFeature>
  );
}

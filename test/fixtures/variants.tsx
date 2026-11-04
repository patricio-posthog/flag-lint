export function Partido() {
  const layout = useFeatureFlagVariantKey("layout");
  if (layout === "compact") return null;
  if ("wide" !== layout) return null;
  switch (layout) {
    case "grid":
      break;
    case "list":
      break;
  }
  if (posthog.getFeatureFlag("direct") == "a") return null;
  const x = posthog.isFeatureEnabled("boolean-only");
  if (x === "ignored") return null;
  return <PostHogFeature flag="tema" match="retro"><PostHogFeature flag="tema-bool" match={true} /></PostHogFeature>;
}

async function server(flags) {
  const v = await flags.getFlag("snapshot");
  return v === "on";
}

function otherScope() {
  const layout = "not-a-flag";
  return layout === "outside";
}

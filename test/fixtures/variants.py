def view(request, user_id):
    match posthog.get_feature_flag("layout", user_id):
        case "compact":
            pass
        case "wide" | "grid":
            pass

    tema = flags.get_flag("tema")
    if tema == "retro":
        pass
    elif tema in ("moderna", "clasica"):
        pass
    if posthog.feature_enabled("boolean-only", user_id) == "ignored":
        pass


def other(tema):
    return tema == "outside"

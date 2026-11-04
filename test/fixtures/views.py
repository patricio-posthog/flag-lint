from posthog import Posthog

posthog = Posthog("phc_x")


def view(request, user_id):
    if posthog.feature_enabled("py-legacy", user_id):
        pass
    variant = posthog.get_feature_flag(key='py-variant', distinct_id=user_id)
    payload = posthog.get_feature_flag_payload("""py-payload""", user_id)
    flags = posthog.evaluate_flags(user_id)
    if flags.is_enabled("py-snapshot"):
        pass
    dynamic = posthog.feature_enabled(f"exp-{variant}", user_id)
    from_var = posthog.feature_enabled(FLAG_KEY, user_id)
    return is_enabled("bare-generic-name")

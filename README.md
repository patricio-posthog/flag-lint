# flag-lint

A GitHub Action that checks your pull requests for PostHog feature flags that don't match your PostHog project. This is a hackathon project and may never be finished or released.

## What it does

On every pull request, flag-lint reads the files that changed, finds the places where your code checks a feature flag, and compares them with the flags in your PostHog project. Then it leaves a comment on the pull request with anything that looks wrong.

It looks for:

* Flags used in code that don't exist in PostHog, with a link to create them already filled in
* Typos in flag keys and variant names, with a fix you can commit from the pull request
* Flags that are archived, disabled or stale but still used
* Variant names your code compares against that the flag doesn't have
* Flags limited to client or server evaluation that are used from the other side
* Code that touches or removes a flag behind a running experiment
* Checks for flags that are on for everyone, with a suggestion to remove the `if`

It also shows how many users saw each flag in the pull request over the last 7 days, so a reviewer knows how many people a change can reach.

It understands TypeScript, JavaScript and Python, including the React hooks and the `PostHogFeature` component.

## Setup

1. Create a personal API key in PostHog with `feature_flag:read` and `query:read`, limited to your project.
2. Add it to your repository as a secret called `POSTHOG_API_KEY`.
3. Add this workflow as `.github/workflows/flag-lint.yml`:

```yaml
name: flag-lint
on: pull_request
permissions:
  contents: read
  pull-requests: write
jobs:
  flag-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: patricio-posthog/flag-lint@v1
        with:
          api-key: ${{ secrets.POSTHOG_API_KEY }}
          project-id: 12345
          host: https://us.posthog.com
```

If your code wraps the PostHog SDK in its own function, list it with `wrappers: useFlag` so those calls get checked too.

## Running it locally

```sh
npm install
npm run build
POSTHOG_API_KEY=phx_... node dist/cli/index.js --project-id 12345 --dir ../your-repo
```

## How it works

flag-lint parses your code with [tree-sitter](https://tree-sitter.github.io/tree-sitter/), so it reads the structure of the code instead of matching text. It talks to the PostHog API for your flags and to the GitHub API for the pull request. Everything runs inside your own GitHub Actions run, and nothing is hosted anywhere else.

## License

MIT

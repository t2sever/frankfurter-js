# Contributing

## Development Setup

Requirements:

- Node.js 18 or newer
- npm

Install dependencies:

```bash
npm install
```

Available commands:

```bash
npm run build
npm run typecheck
npm test
npm run test:watch
```

## Project Scope

This package is a lightweight TypeScript SDK for the Frankfurter API. Contributions should preserve that goal:

- Keep the API close to the upstream HTTP API.
- Avoid adding retries, caching, or opinionated response reshaping unless there is a strong project-level reason.
- Prefer small, composable additions over broad abstractions.

## Making Changes

Before opening a pull request:

1. Make sure the change is scoped and documented.
2. Add or update tests when behavior changes.
3. Run `npm run typecheck`, `npm test`, and `npm run build`.
4. Update `README.md` if the public API or usage changes.
5. Add an entry to `CHANGELOG.md` under `Unreleased`.

## Code Guidelines

- Write TypeScript that is explicit and easy to follow.
- Keep browser and modern Node.js compatibility in mind.
- Preserve the published package surface unless the change intentionally introduces a breaking change.
- Match the existing naming and file organization conventions.

## Pull Requests

Pull requests should include:

- A clear summary of the problem and the change.
- Notes about API impact, if any.
- Tests or rationale when tests are not needed.
- Changelog and documentation updates when applicable.

## Releases

This repository uses `CHANGELOG.md` to track notable changes. Follow Keep a Changelog style entries where practical and use these sections when relevant:

- `Added`
- `Changed`
- `Fixed`
- `Removed`

Versioning should follow Semantic Versioning.

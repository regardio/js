---

title: "@regardio/js — Claude Context"
type: guide
status: published
summary: Entry point for Claude when working on shared JavaScript/TypeScript utilities
locale: en-US
---

# @regardio/js — Claude Context

## What This Is

Framework-agnostic JavaScript/TypeScript utilities shared across the Regardio workspace. Organized by concern:

```text
src/ (mirrored in docs/)
├── assert/     # Runtime assertions
├── encoding/   # Base64, hashing, URL encoding, etc.
├── http/       # Fetch wrappers, status helpers
├── intl/       # Locale, date, currency formatting
├── text/       # String utilities
└── time/       # Date/time helpers
```

## Boundaries

- **JS only**: no React, no DOM-specific code. React utilities belong in [`../react`](../react).
- **Framework-agnostic**: anything here must work server-side and client-side.
- **Small surface**: each module exports a minimal, focused set of helpers.

## Standards

Universal standards apply: [`../dev/CLAUDE.md`](../dev/CLAUDE.md). Coding patterns: [`../dev/docs/en/standards/coding.md`](../dev/docs/en/standards/coding.md).

## Downstream Consumers

Every React app and package in the workspace. Breaking changes require a version bump and consumer review.

Full module docs: [`docs/README.md`](./docs/README.md).

---
name: Scoped workspace installs
description: Package installation rule for this pnpm monorepo.
---

When adding a dependency to one artifact, install it with a pnpm workspace filter targeting that package.

**Why:** A root-level install was rejected by pnpm's workspace-root safety check and did not make the API artifact's dependencies available until the package was targeted explicitly.

**How to apply:** Use `pnpm --filter @workspace/<artifact> add <package>` for artifact-specific dependencies, then rerun that artifact's typecheck/build.
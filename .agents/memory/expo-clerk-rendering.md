---
name: Expo Clerk rendering
description: Why the mobile preview must not be gated by Clerk initialization.
---

The Expo app should render its guest/local experience immediately while Clerk initializes. Authentication-dependent queries and sync actions can remain disabled until a signed-in session exists.

**Why:** Wrapping the entire root navigation in `ClerkLoaded` caused the web preview to remain blank even though Metro bundled successfully.

**How to apply:** Keep the Clerk provider and token bridge at the root, but do not block the app tree on `ClerkLoaded`; use `isSignedIn` to gate remote history/sync requests.
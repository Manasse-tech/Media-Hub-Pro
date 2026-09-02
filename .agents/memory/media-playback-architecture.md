---
name: Media playback architecture
description: Durable rules for the Expo media player and its synchronized user state.
---

The application should keep one global playback controller mounted above tab navigation. Screens select media or queues through shared context; they should not create their own player or modal instance.

**Why:** Multiple mounted player instances caused duplicated resource ownership and inconsistent playback controls when navigating between tabs.

**How to apply:** Keep player source loading conditional on an open player and current media, and route all play, queue, next, previous, repeat, and close actions through the shared media context.

Full-state synchronization writes must be serialized and sent only after local hydration and the first remote merge. Local and remote favorites, playlists, and history should be merged rather than replacing local state.

**Why:** Concurrent full-state PUT requests can arrive out of order and overwrite newer user changes; replacing local history also loses offline activity.

**How to apply:** Queue sync mutations, validate and bound payloads server-side, and preserve local-only media while merging server data.
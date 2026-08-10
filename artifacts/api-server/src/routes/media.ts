import { and, desc, eq } from "drizzle-orm";
import { Router, type IRouter, type RequestHandler } from "express";
import { getAuth } from "@clerk/express";
import { db, historyTable, mediaStateTable } from "@workspace/db";

type HistoryItem = {
  id: string;
  title: string;
  artist: string;
  type: "audio" | "video";
  uri: string;
  artwork?: string;
  playedAt: string;
};

type SyncState = {
  favorites: string[];
  playlists: Array<{ id: string; name: string; itemIds: string[] }>;
};

const requireAuth: RequestHandler = (req, res, next) => {
  const auth = getAuth(req);
  const userId = auth?.userId || auth?.sessionClaims?.userId;
  if (!userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  res.locals.userId = userId;
  next();
};

const router: IRouter = Router();

router.get("/history", requireAuth, async (_req, res) => {
  const rows = await db
    .select()
    .from(historyTable)
    .where(eq(historyTable.userId, String(res.locals.userId)))
    .orderBy(desc(historyTable.playedAt))
    .limit(30);

  res.json(
    rows.map((row) => ({
      id: row.itemId,
      title: row.title,
      artist: row.artist,
      type: row.type === "video" ? "video" : "audio",
      uri: row.uri,
      artwork: row.artwork ?? undefined,
      playedAt: row.playedAt.toISOString(),
    })),
  );
});

router.post("/history", requireAuth, async (req, res) => {
  const body = req.body as {
    id?: string;
    title?: string;
    artist?: string;
    type?: "audio" | "video";
    uri?: string;
    artwork?: string;
  };
  if (!body.id || !body.title || !body.artist || !body.type || !body.uri) {
    res.status(400).json({ error: "Invalid media item" });
    return;
  }

  const userId = String(res.locals.userId);
  await db
    .delete(historyTable)
    .where(and(eq(historyTable.userId, userId), eq(historyTable.itemId, body.id)));
  const [row] = await db
    .insert(historyTable)
    .values({
      userId,
      itemId: body.id,
      title: body.title,
      artist: body.artist,
      type: body.type,
      uri: body.uri,
      artwork: body.artwork,
    })
    .returning();

  res.status(201).json({
    id: row.itemId,
    title: row.title,
    artist: row.artist,
    type: row.type === "video" ? "video" : "audio",
    uri: row.uri,
    artwork: row.artwork ?? undefined,
    playedAt: row.playedAt.toISOString(),
  } satisfies HistoryItem);
});

router.get("/sync", requireAuth, async (_req, res) => {
  const [state] = await db
    .select()
    .from(mediaStateTable)
    .where(eq(mediaStateTable.userId, String(res.locals.userId)))
    .limit(1);
  res.json({
    favorites: state?.favorites ?? [],
    playlists: state?.playlists ?? [],
  } satisfies SyncState);
});

router.put("/sync", requireAuth, async (req, res) => {
  const body = req.body as Partial<SyncState>;
  const state: SyncState = {
    favorites: Array.isArray(body.favorites) ? body.favorites.slice(0, 500) : [],
    playlists: Array.isArray(body.playlists) ? body.playlists.slice(0, 100) : [],
  };
  const userId = String(res.locals.userId);

  await db
    .insert(mediaStateTable)
    .values({ userId, ...state })
    .onConflictDoUpdate({
      target: mediaStateTable.userId,
      set: { favorites: state.favorites, playlists: state.playlists, updatedAt: new Date() },
    });

  res.json(state);
});

export default router;
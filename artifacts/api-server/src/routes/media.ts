import { desc, eq } from "drizzle-orm";
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
const isBoundedString = (value: unknown, max: number): value is string =>
  typeof value === "string" && value.trim().length > 0 && value.trim().length <= max;

const hasOnlyKeys = (value: Record<string, unknown>, allowed: string[]) =>
  Object.keys(value).every((key) => allowed.includes(key));

function parseMediaInput(value: unknown): { ok: true; value: HistoryItem } | { ok: false } {
  if (!value || typeof value !== "object") return { ok: false };
  const body = value as Record<string, unknown>;
  if (!hasOnlyKeys(body, ["id", "title", "artist", "type", "uri", "artwork"])) return { ok: false };
  if (!isBoundedString(body.id, 200) || !isBoundedString(body.title, 200) || !isBoundedString(body.artist, 200)) return { ok: false };
  if (body.type !== "audio" && body.type !== "video") return { ok: false };
  if (!isBoundedString(body.uri, 4096)) return { ok: false };
  if (body.artwork !== undefined && (typeof body.artwork !== "string" || body.artwork.trim().length > 4096)) return { ok: false };
  return {
    ok: true,
    value: {
      id: body.id.trim(),
      title: body.title.trim(),
      artist: body.artist.trim(),
      type: body.type,
      uri: body.uri.trim(),
      artwork: typeof body.artwork === "string" ? body.artwork.trim() : undefined,
      playedAt: new Date().toISOString(),
    },
  };
}

function parseSyncState(value: unknown): { ok: true; value: SyncState } | { ok: false } {
  if (!value || typeof value !== "object") return { ok: false };
  const body = value as Record<string, unknown>;
  if (!hasOnlyKeys(body, ["favorites", "playlists"]) || !Array.isArray(body.favorites) || !Array.isArray(body.playlists)) return { ok: false };
  const favorites = body.favorites.filter((item): item is string => isBoundedString(item, 200)).map((item) => item.trim());
  if (favorites.length !== body.favorites.length || favorites.length > 500) return { ok: false };
  const playlists: SyncState["playlists"] = [];
  for (const item of body.playlists) {
    if (!item || typeof item !== "object") return { ok: false };
    const playlist = item as Record<string, unknown>;
    if (!hasOnlyKeys(playlist, ["id", "name", "itemIds"]) || !isBoundedString(playlist.id, 200) || !isBoundedString(playlist.name, 80) || !Array.isArray(playlist.itemIds) || playlist.itemIds.length > 1000) return { ok: false };
    const itemIds = playlist.itemIds.filter((itemId): itemId is string => isBoundedString(itemId, 200)).map((itemId) => itemId.trim());
    if (itemIds.length !== playlist.itemIds.length) return { ok: false };
    playlists.push({ id: playlist.id.trim(), name: playlist.name.trim(), itemIds });
  }
  if (playlists.length > 100) return { ok: false };
  return { ok: true, value: { favorites, playlists } };
}
const asyncRoute = (handler: (req: Parameters<RequestHandler>[0], res: Parameters<RequestHandler>[1]) => Promise<void>): RequestHandler =>
  (req, res, next) => { void handler(req, res).catch(next); };

router.get("/history", requireAuth, asyncRoute(async (_req, res) => {
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
}));

router.post("/history", requireAuth, asyncRoute(async (req, res) => {
  const parsed = parseMediaInput(req.body);
  if (!parsed.ok) {
    res.status(400).json({ error: "Invalid media item" });
    return;
  }
  const body = parsed.value;

  const userId = String(res.locals.userId);
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
      playedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [historyTable.userId, historyTable.itemId],
      set: {
        title: body.title,
        artist: body.artist,
        type: body.type,
        uri: body.uri,
        artwork: body.artwork,
        playedAt: new Date(),
      },
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
}));

router.get("/sync", requireAuth, asyncRoute(async (_req, res) => {
  const [state] = await db
    .select()
    .from(mediaStateTable)
    .where(eq(mediaStateTable.userId, String(res.locals.userId)))
    .limit(1);
  res.json({
    favorites: state?.favorites ?? [],
    playlists: state?.playlists ?? [],
  } satisfies SyncState);
}));

router.put("/sync", requireAuth, asyncRoute(async (req, res) => {
  const parsed = parseSyncState(req.body);
  if (!parsed.ok) {
    res.status(400).json({ error: "Invalid sync state" });
    return;
  }
  const state: SyncState = parsed.value;
  const userId = String(res.locals.userId);

  await db
    .insert(mediaStateTable)
    .values({ userId, ...state })
    .onConflictDoUpdate({
      target: mediaStateTable.userId,
      set: { favorites: state.favorites, playlists: state.playlists, updatedAt: new Date() },
    });

  res.json(state);
}));

export default router;
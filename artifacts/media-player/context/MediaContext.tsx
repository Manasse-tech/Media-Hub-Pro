import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addHistory,
  getHistory,
  getGetHistoryQueryKey,
  getGetSyncStateQueryKey,
  getSyncState,
  putSyncState,
} from '@workspace/api-client-react';
import type { Playlist, SyncState } from '@workspace/api-client-react';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

export type LocalMedia = {
  id: string;
  title: string;
  artist: string;
  type: 'audio' | 'video';
  uri: string;
  artwork?: string | number;
  description?: string;
  lyrics?: string;
  isOnline?: boolean;
  duration?: number;
  size?: number;
  addedAt?: string;
};

export type RepeatMode = 'off' | 'all' | 'one';

type MediaContextValue = {
  library: LocalMedia[];
  history: LocalMedia[];
  favorites: string[];
  playlists: Playlist[];
  current: LocalMedia | null;
  queue: LocalMedia[];
  queueIndex: number;
  isPlaying: boolean;
  playerVisible: boolean;
  repeatMode: RepeatMode;
  isHydrated: boolean;
  isSyncing: boolean;
  syncError: string | null;
  setCurrent: (item: LocalMedia | null) => void;
  openPlayer: (item?: LocalMedia) => void;
  playQueue: (items: LocalMedia[]) => void;
  closePlayer: () => void;
  togglePlaying: () => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  addToLibrary: (item: LocalMedia) => void;
  addManyToLibrary: (items: LocalMedia[]) => void;
  toggleFavorite: (id: string) => void;
  createPlaylist: (name: string) => void;
  renamePlaylist: (playlistId: string, name: string) => void;
  deletePlaylist: (playlistId: string) => void;
  addToPlaylist: (playlistId: string, itemId: string) => void;
  removeFromPlaylist: (playlistId: string, itemId: string) => void;
  movePlaylistItem: (playlistId: string, itemId: string, direction: 'up' | 'down') => void;
  removeFromLibrary: (id: string) => void;
  clearHistory: () => void;
  search: (query: string) => LocalMedia[];
};

const MediaContext = createContext<MediaContextValue | null>(null);
const LIBRARY_KEY = '@media-player/library';
const FAVORITES_KEY = '@media-player/favorites';
const PLAYLISTS_KEY = '@media-player/playlists';
const HISTORY_KEY = '@media-player/history';

const starterLibrary: LocalMedia[] = [
  {
    id: 'neon-drift',
    title: 'Neon Drift',
    artist: 'Luma District',
    type: 'audio',
    uri: 'https://storage.googleapis.com/coverr-main/mp3/MtBaker.mp3',
    artwork: require('@/assets/images/album-neon.jpg'),
    description: 'Une session électronique douce pour avancer sans distraction.',
    lyrics: 'City lights move slowly\nUnder a violet sky\nWe keep drifting forward',
    isOnline: true,
    addedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'afterglow',
    title: 'Afterglow',
    artist: 'Mira Sol',
    type: 'audio',
    uri: 'https://storage.googleapis.com/coverr-main/mp3/Footsteps.mp3',
    artwork: require('@/assets/images/featured-night.jpg'),
    description: 'Un morceau ambient cinématique, pensé pour les fins de journée.',
    lyrics: 'Stay with the afterglow\nLet the quiet take control',
    isOnline: true,
    addedAt: '2026-01-02T00:00:00.000Z',
  },
  {
    id: 'desert-frame',
    title: 'Desert Frame',
    artist: 'Open Cinema',
    type: 'video',
    uri: 'https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4',
    artwork: require('@/assets/images/film-desert.jpg'),
    description: 'Un extrait de voyage libre de droits, optimisé pour la lecture plein écran.',
    isOnline: true,
    addedAt: '2026-01-03T00:00:00.000Z',
  },
];

function parseStored<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function mergePlaylists(local: Playlist[], remote: Playlist[]): Playlist[] {
  const byId = new Map(local.map((playlist) => [playlist.id, playlist]));
  remote.forEach((playlist) => {
    const existing = byId.get(playlist.id);
    byId.set(playlist.id, existing
      ? { ...existing, name: existing.name || playlist.name, itemIds: Array.from(new Set([...existing.itemIds, ...playlist.itemIds])) }
      : playlist);
  });
  return Array.from(byId.values());
}

export function MediaProvider({
  children,
  isSignedIn = false,
}: {
  children: React.ReactNode;
  isSignedIn?: boolean;
}) {
  const queryClient = useQueryClient();
  const [library, setLibrary] = useState<LocalMedia[]>(starterLibrary);
  const [history, setHistory] = useState<LocalMedia[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [current, setCurrentState] = useState<LocalMedia | null>(null);
  const [queue, setQueue] = useState<LocalMedia[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerVisible, setPlayerVisible] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [isHydrated, setIsHydrated] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const remoteApplied = useRef(false);
  const syncChain = useRef(Promise.resolve());

  const historyQuery = useQuery({
    queryKey: getGetHistoryQueryKey(),
    queryFn: getHistory,
    retry: 1,
    enabled: isSignedIn,
  });
  const syncQuery = useQuery({
    queryKey: getGetSyncStateQueryKey(),
    queryFn: getSyncState,
    retry: 1,
    enabled: isSignedIn,
  });
  const historyMutation = useMutation({ mutationFn: (item: Parameters<typeof addHistory>[0]) => addHistory(item) });
  const syncMutation = useMutation({
    mutationFn: (state: SyncState) => putSyncState(state),
    onError: (error) => setSyncError(error instanceof Error ? error.message : 'Synchronisation impossible'),
    onSuccess: () => setSyncError(null),
  });

  const persist = useCallback(async (key: string, value: unknown) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Local storage can be unavailable in restricted preview environments.
    }
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([
      AsyncStorage.getItem(LIBRARY_KEY),
      AsyncStorage.getItem(HISTORY_KEY),
      AsyncStorage.getItem(FAVORITES_KEY),
      AsyncStorage.getItem(PLAYLISTS_KEY),
    ]).then(([storedLibrary, storedHistory, storedFavorites, storedPlaylists]) => {
      if (!active) return;
      setLibrary(parseStored(storedLibrary, starterLibrary));
      setHistory(parseStored(storedHistory, []));
      setFavorites(parseStored(storedFavorites, []));
      setPlaylists(parseStored(storedPlaylists, []));
      setIsHydrated(true);
    }).catch(() => setIsHydrated(true));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!isSignedIn) {
      remoteApplied.current = false;
      return;
    }
    if (!syncQuery.data || !isHydrated || remoteApplied.current) return;
    remoteApplied.current = true;
    setFavorites((local) => Array.from(new Set([...local, ...syncQuery.data.favorites])));
    setPlaylists((local) => mergePlaylists(local, syncQuery.data.playlists));
  }, [isSignedIn, isHydrated, syncQuery.data]);

  useEffect(() => {
    if (!isSignedIn || !isHydrated || !remoteApplied.current) return;
    const snapshot = { favorites, playlists };
    syncChain.current = syncChain.current
      .catch(() => undefined)
      .then(() => syncMutation.mutateAsync(snapshot))
      .then(() => undefined);
  }, [favorites, playlists, isSignedIn, isHydrated]);

  useEffect(() => {
    if (!historyQuery.data || !isHydrated) return;
    const remote = historyQuery.data.map((item) => ({ ...item, artwork: item.artwork ?? undefined }));
    setHistory((local) => {
      const byId = new Map(local.map((item) => [item.id, item]));
      remote.forEach((item) => byId.set(item.id, { ...byId.get(item.id), ...item }));
      const next = Array.from(byId.values()).slice(0, 30);
      void persist(HISTORY_KEY, next);
      return next;
    });
  }, [historyQuery.data, isHydrated, persist]);

  const play = useCallback((item: LocalMedia, nextQueue?: LocalMedia[]) => {
    const effectiveQueue = nextQueue?.length ? nextQueue : (queue.length ? queue : [item]);
    const index = Math.max(0, effectiveQueue.findIndex((entry) => entry.id === item.id));
    setQueue(effectiveQueue);
    setQueueIndex(index);
    setCurrentState(item);
    setIsPlaying(true);
    setHistory((previous) => {
      const next = [item, ...previous.filter((entry) => entry.id !== item.id)].slice(0, 30);
      void persist(HISTORY_KEY, next);
      return next;
    });
    if (isSignedIn && item.isOnline) {
      void historyMutation.mutateAsync({
        id: item.id,
        title: item.title,
        artist: item.artist,
        type: item.type,
        uri: item.uri,
        artwork: typeof item.artwork === 'string' ? item.artwork : undefined,
      }).then(() => queryClient.invalidateQueries({ queryKey: getGetHistoryQueryKey() })).catch(() => undefined);
    }
  }, [historyMutation, isSignedIn, persist, queryClient, queue]);

  const setCurrent = useCallback((item: LocalMedia | null) => {
    if (!item) {
      setCurrentState(null);
      setIsPlaying(false);
      return;
    }
    play(item);
  }, [play]);

  const openPlayer = useCallback((item?: LocalMedia) => {
    if (item) play(item);
    setPlayerVisible(true);
  }, [play]);

  const playQueue = useCallback((items: LocalMedia[]) => {
    if (items.length) play(items[0], items);
  }, [play]);

  const playNext = useCallback(() => {
    if (!queue.length) return;
    if (repeatMode === 'one' && current) {
      play(current, queue);
      return;
    }
    const nextIndex = queueIndex + 1;
    if (nextIndex >= queue.length && repeatMode !== 'all') {
      setIsPlaying(false);
      return;
    }
    play(queue[nextIndex % queue.length], queue);
  }, [current, play, queue, queueIndex, repeatMode]);

  const playPrevious = useCallback(() => {
    if (!queue.length) return;
    const previousIndex = queueIndex <= 0 ? (repeatMode === 'all' ? queue.length - 1 : 0) : queueIndex - 1;
    play(queue[previousIndex], queue);
  }, [play, queue, queueIndex, repeatMode]);

  const addManyToLibrary = useCallback((items: LocalMedia[]) => {
    setLibrary((previous) => {
      const incoming = items.filter((item) => item.id && item.uri);
      const next = [...incoming, ...previous.filter((item) => !incoming.some((newItem) => newItem.id === item.id))];
      void persist(LIBRARY_KEY, next);
      return next;
    });
  }, [persist]);

  const addToLibrary = useCallback((item: LocalMedia) => addManyToLibrary([item]), [addManyToLibrary]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((previous) => {
      const next = previous.includes(id) ? previous.filter((value) => value !== id) : [...previous, id];
      void persist(FAVORITES_KEY, next);
      return next;
    });
  }, [persist]);

  const createPlaylist = useCallback((name: string) => {
    const cleanName = name.trim().slice(0, 80);
    if (!cleanName) return;
    const playlist: Playlist = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: cleanName,
      itemIds: [],
    };
    setPlaylists((previous) => {
      const next = [...previous, playlist];
      void persist(PLAYLISTS_KEY, next);
      return next;
    });
  }, [persist]);

  const renamePlaylist = useCallback((playlistId: string, name: string) => {
    const cleanName = name.trim().slice(0, 80);
    if (!cleanName) return;
    setPlaylists((previous) => {
      const next = previous.map((playlist) => playlist.id === playlistId ? { ...playlist, name: cleanName } : playlist);
      void persist(PLAYLISTS_KEY, next);
      return next;
    });
  }, [persist]);

  const deletePlaylist = useCallback((playlistId: string) => {
    setPlaylists((previous) => {
      const next = previous.filter((playlist) => playlist.id !== playlistId);
      void persist(PLAYLISTS_KEY, next);
      return next;
    });
  }, [persist]);

  const addToPlaylist = useCallback((playlistId: string, itemId: string) => {
    setPlaylists((previous) => {
      const next = previous.map((playlist) => playlist.id === playlistId && !playlist.itemIds.includes(itemId)
        ? { ...playlist, itemIds: [...playlist.itemIds, itemId] }
        : playlist);
      void persist(PLAYLISTS_KEY, next);
      return next;
    });
  }, [persist]);

  const removeFromPlaylist = useCallback((playlistId: string, itemId: string) => {
    setPlaylists((previous) => {
      const next = previous.map((playlist) => playlist.id === playlistId
        ? { ...playlist, itemIds: playlist.itemIds.filter((id) => id !== itemId) }
        : playlist);
      void persist(PLAYLISTS_KEY, next);
      return next;
    });
  }, [persist]);

  const movePlaylistItem = useCallback((playlistId: string, itemId: string, direction: 'up' | 'down') => {
    setPlaylists((previous) => {
      const next = previous.map((playlist) => {
        if (playlist.id !== playlistId) return playlist;
        const index = playlist.itemIds.indexOf(itemId);
        const target = direction === 'up' ? index - 1 : index + 1;
        if (index < 0 || target < 0 || target >= playlist.itemIds.length) return playlist;
        const itemIds = [...playlist.itemIds];
        [itemIds[index], itemIds[target]] = [itemIds[target], itemIds[index]];
        return { ...playlist, itemIds };
      });
      void persist(PLAYLISTS_KEY, next);
      return next;
    });
  }, [persist]);

  const removeFromLibrary = useCallback((id: string) => {
    setLibrary((previous) => {
      const next = previous.filter((item) => item.id !== id);
      void persist(LIBRARY_KEY, next);
      return next;
    });
    setFavorites((previous) => {
      const next = previous.filter((value) => value !== id);
      void persist(FAVORITES_KEY, next);
      return next;
    });
    setPlaylists((previous) => {
      const next = previous.map((playlist) => ({ ...playlist, itemIds: playlist.itemIds.filter((itemId) => itemId !== id) }));
      void persist(PLAYLISTS_KEY, next);
      return next;
    });
    if (current?.id === id) {
      setCurrentState(null);
      setIsPlaying(false);
      setPlayerVisible(false);
    }
  }, [current?.id, persist]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    void persist(HISTORY_KEY, []);
  }, [persist]);

  const value = useMemo<MediaContextValue>(() => ({
    library,
    history,
    favorites,
    playlists,
    current,
    queue,
    queueIndex,
    isPlaying,
    playerVisible,
    repeatMode,
    isHydrated,
    isSyncing: syncMutation.isPending,
    syncError,
    setCurrent,
    openPlayer,
    playQueue,
    closePlayer: () => setPlayerVisible(false),
    togglePlaying: () => setIsPlaying((value) => value && current ? !value : Boolean(current)),
    playNext,
    playPrevious,
    toggleRepeat: () => setRepeatMode((mode) => mode === 'off' ? 'all' : mode === 'all' ? 'one' : 'off'),
    toggleShuffle: () => {
      if (!queue.length) return;
      const rest = queue.filter((item) => item.id !== current?.id).sort(() => Math.random() - 0.5);
      setQueue(current ? [current, ...rest] : rest);
      setQueueIndex(0);
    },
    addToLibrary,
    addManyToLibrary,
    toggleFavorite,
    createPlaylist,
    renamePlaylist,
    deletePlaylist,
    addToPlaylist,
    removeFromPlaylist,
    movePlaylistItem,
    removeFromLibrary,
    clearHistory,
    search: (query) => {
      const normalized = query.trim().toLowerCase();
      if (!normalized) return library;
      return library.filter((item) => `${item.title} ${item.artist}`.toLowerCase().includes(normalized));
    },
  }), [
    library, history, favorites, playlists, current, queue, queueIndex, isPlaying, playerVisible,
    repeatMode, isHydrated, syncMutation.isPending, syncError, setCurrent, openPlayer, playQueue, playNext,
    playPrevious, addToLibrary, addManyToLibrary, toggleFavorite, createPlaylist, renamePlaylist,
    deletePlaylist, addToPlaylist, removeFromPlaylist, movePlaylistItem, removeFromLibrary, clearHistory,
  ]);

  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>;
}

export function useMedia() {
  const context = useContext(MediaContext);
  if (!context) throw new Error('useMedia must be used inside MediaProvider');
  return context;
}
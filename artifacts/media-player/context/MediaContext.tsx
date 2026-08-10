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
import { useAuth } from '@clerk/expo';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

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
};

type MediaContextValue = {
  library: LocalMedia[];
  history: LocalMedia[];
  favorites: string[];
  playlists: Playlist[];
  current: LocalMedia | null;
  isPlaying: boolean;
  setCurrent: (item: LocalMedia | null) => void;
  togglePlaying: () => void;
  addToLibrary: (item: LocalMedia) => void;
  toggleFavorite: (id: string) => void;
  createPlaylist: (name: string) => void;
  addToPlaylist: (playlistId: string, itemId: string) => void;
  removeFromLibrary: (id: string) => void;
  search: (query: string) => LocalMedia[];
  isSyncing: boolean;
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

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { isSignedIn } = useAuth();
  const [library, setLibrary] = useState<LocalMedia[]>(starterLibrary);
  const [history, setHistory] = useState<LocalMedia[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [current, setCurrent] = useState<LocalMedia | null>(starterLibrary[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const historyQuery = useQuery({
    queryKey: getGetHistoryQueryKey(),
    queryFn: getHistory,
    retry: false,
    enabled: Boolean(isSignedIn),
  });
  const syncQuery = useQuery({
    queryKey: getGetSyncStateQueryKey(),
    queryFn: getSyncState,
    retry: false,
    enabled: Boolean(isSignedIn),
  });
  const historyMutation = useMutation({ mutationFn: (item: Parameters<typeof addHistory>[0]) => addHistory(item) });
  const syncMutation = useMutation({ mutationFn: (state: SyncState) => putSyncState(state) });

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(LIBRARY_KEY),
      AsyncStorage.getItem(HISTORY_KEY),
      AsyncStorage.getItem(FAVORITES_KEY),
      AsyncStorage.getItem(PLAYLISTS_KEY),
    ]).then(([storedLibrary, storedHistory, storedFavorites, storedPlaylists]) => {
      setLibrary(parseStored(storedLibrary, starterLibrary));
      setHistory(parseStored(storedHistory, []));
      setFavorites(parseStored(storedFavorites, []));
      setPlaylists(parseStored(storedPlaylists, []));
    });
  }, []);

  useEffect(() => {
    if (!historyQuery.data) return;
    const remote = historyQuery.data.map((item) => ({ ...item, artwork: item.artwork ?? undefined }));
    if (remote.length) setHistory(remote);
  }, [historyQuery.data]);

  useEffect(() => {
    if (!syncQuery.data) return;
    setFavorites(syncQuery.data.favorites);
    setPlaylists(syncQuery.data.playlists);
  }, [syncQuery.data]);

  const persist = async (key: string, value: unknown) => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  };

  const addToLibrary = (item: LocalMedia) => {
    setLibrary((previous) => {
      const next = [item, ...previous.filter((entry) => entry.id !== item.id)];
      void persist(LIBRARY_KEY, next);
      return next;
    });
  };

  const play = (item: LocalMedia) => {
    setCurrent(item);
    setIsPlaying(true);
    setHistory((previous) => {
      const next = [item, ...previous.filter((entry) => entry.id !== item.id)].slice(0, 30);
      void persist(HISTORY_KEY, next);
      return next;
    });
    if (item.isOnline) {
      void historyMutation.mutateAsync({
        id: item.id,
        title: item.title,
        artist: item.artist,
        type: item.type,
        uri: item.uri,
        artwork: typeof item.artwork === 'string' ? item.artwork : undefined,
      }).then(() => queryClient.invalidateQueries({ queryKey: getGetHistoryQueryKey() }));
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((previous) => {
      const next = previous.includes(id) ? previous.filter((value) => value !== id) : [...previous, id];
      void persist(FAVORITES_KEY, next);
      void syncMutation.mutateAsync({ favorites: next, playlists });
      return next;
    });
  };

  const createPlaylist = (name: string) => {
    const playlist: Playlist = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim(),
      itemIds: [],
    };
    if (!playlist.name) return;
    setPlaylists((previous) => {
      const next = [...previous, playlist];
      void persist(PLAYLISTS_KEY, next);
      void syncMutation.mutateAsync({ favorites, playlists: next });
      return next;
    });
  };

  const addToPlaylist = (playlistId: string, itemId: string) => {
    setPlaylists((previous) => {
      const next = previous.map((playlist) =>
        playlist.id === playlistId && !playlist.itemIds.includes(itemId)
          ? { ...playlist, itemIds: [...playlist.itemIds, itemId] }
          : playlist,
      );
      void persist(PLAYLISTS_KEY, next);
      void syncMutation.mutateAsync({ favorites, playlists: next });
      return next;
    });
  };

  const removeFromLibrary = (id: string) => {
    setLibrary((previous) => {
      const next = previous.filter((item) => item.id !== id);
      void persist(LIBRARY_KEY, next);
      return next;
    });
  };

  const value = useMemo<MediaContextValue>(() => ({
    library,
    history,
    favorites,
    playlists,
    current,
    isPlaying,
    setCurrent: (item) => item ? play(item) : setCurrent(null),
    togglePlaying: () => setIsPlaying((value) => !value),
    addToLibrary,
    toggleFavorite,
    createPlaylist,
    addToPlaylist,
    removeFromLibrary,
    search: (query) => {
      const normalized = query.trim().toLowerCase();
      if (!normalized) return library;
      return library.filter((item) => `${item.title} ${item.artist}`.toLowerCase().includes(normalized));
    },
    isSyncing: syncMutation.isPending,
  }), [library, history, favorites, playlists, current, isPlaying, syncMutation.isPending]);

  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>;
}

export function useMedia() {
  const context = useContext(MediaContext);
  if (!context) throw new Error('useMedia must be used inside MediaProvider');
  return context;
}
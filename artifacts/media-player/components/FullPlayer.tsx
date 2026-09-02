import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useEvent } from 'expo';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { useMedia, type RepeatMode } from '@/context/MediaContext';

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainder}`;
}

export function FullPlayer({
  visible,
  onClose,
}: {
  visible?: boolean;
  onClose?: () => void;
}) {
  const colors = useColors();
  const {
    current,
    isPlaying,
    playerVisible,
    closePlayer,
    togglePlaying,
    toggleFavorite,
    favorites,
    playNext,
    playPrevious,
    repeatMode,
    toggleRepeat,
  } = useMedia();
  const isVisible = visible ?? playerVisible;
  const close = onClose ?? closePlayer;
  const audioPlayer = useAudioPlayer(
    current?.type === 'audio' && isVisible ? current.uri : null,
    { updateInterval: 250, keepAudioSessionActive: true },
  );
  const audioStatus = useAudioPlayerStatus(audioPlayer);
  const videoPlayer = useVideoPlayer(
    current?.type === 'video' && isVisible ? current.uri : null,
    (player) => {
      player.loop = false;
      player.timeUpdateEventInterval = 0.25;
      player.showNowPlayingNotification = true;
      player.staysActiveInBackground = true;
    },
  );
  const videoTime = useEvent(videoPlayer, 'timeUpdate', {
    currentTime: 0,
    currentLiveTimestamp: null,
    currentOffsetFromLive: 0,
    bufferedPosition: 0,
  });
  const videoPlaying = useEvent(videoPlayer, 'playingChange', { isPlaying: false });
  const videoStatus = useEvent(videoPlayer, 'statusChange', { status: 'idle' as const });
  const videoDuration = videoPlayer.duration;

  useEffect(() => {
    void setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'doNotMix',
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!current || !isVisible) return;
    if (current.type === 'audio') {
      if (isPlaying && !audioStatus.playing) audioPlayer.play();
      if (!isPlaying && audioStatus.playing) audioPlayer.pause();
    } else {
      if (isPlaying && !videoPlaying.isPlaying) videoPlayer.play();
      if (!isPlaying && videoPlaying.isPlaying) videoPlayer.pause();
    }
  }, [audioPlayer, audioStatus.playing, current, isPlaying, isVisible, videoPlayer, videoPlaying.isPlaying]);

  useEffect(() => {
    if (audioStatus.didJustFinish && repeatMode === 'one') audioPlayer.seekTo(0);
    if (audioStatus.didJustFinish && repeatMode !== 'one') playNext();
  }, [audioStatus.didJustFinish, audioPlayer, playNext, repeatMode]);

  useEffect(() => {
    if (videoStatus.status === 'error') {
      close();
    }
  }, [close, videoStatus.status]);

  const duration = current?.type === 'audio' ? audioStatus.duration : videoDuration;
  const position = current?.type === 'audio' ? audioStatus.currentTime : (videoTime?.currentTime ?? 0);
  const progress = duration > 0 ? Math.min(1, position / duration) : 0;
  const loading = current?.type === 'audio'
    ? !audioStatus.isLoaded && isVisible
    : videoStatus.status === 'loading' && isVisible;
  const activePlaying = current?.type === 'audio' ? audioStatus.playing : videoPlaying.isPlaying;
  const repeatIcon: keyof typeof Feather.glyphMap = repeatMode === 'one' ? 'repeat' : 'repeat';
  const [progressWidth, setProgressWidth] = useState(1);

  const seek = (ratio: number) => {
    const nextPosition = Math.max(0, Math.min(duration || 0, (duration || 0) * ratio));
    if (current?.type === 'audio') audioPlayer.seekTo(nextPosition);
    else videoPlayer.currentTime = nextPosition;
  };

  if (!current) return null;
  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={close} presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.topbar}>
          <Pressable testID="close-player" onPress={close} hitSlop={12} accessibilityLabel="Fermer le lecteur" accessibilityRole="button">
            <Feather name="chevron-down" size={26} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.topTitle, { color: colors.mutedForeground }]}>LECTEUR</Text>
          <Pressable onPress={() => toggleFavorite(current.id)} hitSlop={12} accessibilityLabel="Ajouter aux favoris" accessibilityRole="button">
            <Feather name="heart" size={22} color={favorites.includes(current.id) ? colors.accent : colors.foreground} />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {current.type === 'video' ? (
            <View style={[styles.video, { backgroundColor: colors.card }]}>
              <VideoView player={videoPlayer} style={StyleSheet.absoluteFill} contentFit="contain" nativeControls allowsFullscreen />
              {loading ? <ActivityIndicator size="large" color={colors.primary} style={StyleSheet.absoluteFill} /> : null}
            </View>
          ) : (
            <View style={[styles.heroArt, { backgroundColor: colors.secondary }]}>
              {current.artwork ? <Image source={current.artwork} style={StyleSheet.absoluteFill} contentFit="cover" /> : null}
              <View style={styles.glassIcon}><Feather name="music" size={28} color={colors.primary} /></View>
              {loading ? <ActivityIndicator size="large" color={colors.primary} style={styles.loader} /> : null}
            </View>
          )}
          <View style={styles.info}>
            <Text style={[styles.title, { color: colors.foreground }]}>{current.title}</Text>
            <Text style={[styles.artist, { color: colors.primary }]}>{current.artist}</Text>
          </View>
          <Pressable
            testID="player-progress"
            accessibilityRole="adjustable"
            accessibilityLabel="Position de lecture"
            onLayout={(event) => setProgressWidth(Math.max(event.nativeEvent.layout.width, 1))}
            onPress={(event) => seek(event.nativeEvent.locationX / progressWidth)}
            style={[styles.progressTrack, { backgroundColor: colors.secondary }]}
          >
            <View style={[styles.progress, { width: `${Math.round(progress * 100)}%`, backgroundColor: colors.primary }]} />
          </Pressable>
          <View style={styles.timeRow}>
            <Text style={[styles.time, { color: colors.mutedForeground }]}>{formatTime(position)}</Text>
            <Text style={[styles.time, { color: colors.mutedForeground }]}>{formatTime(duration)}</Text>
          </View>
          <View style={styles.controls}>
            <Pressable onPress={toggleRepeat} hitSlop={12} accessibilityLabel={`Répétition ${repeatMode}`} accessibilityRole="button">
              <Feather name={repeatIcon} size={21} color={repeatMode === 'off' ? colors.mutedForeground : colors.primary} />
            </Pressable>
            <Pressable onPress={playPrevious} hitSlop={12} accessibilityLabel="Piste précédente" accessibilityRole="button">
              <Feather name="skip-back" size={24} color={colors.foreground} />
            </Pressable>
            <Pressable testID="player-toggle" onPress={togglePlaying} style={[styles.mainPlay, { backgroundColor: colors.primary }]} accessibilityLabel={activePlaying ? 'Mettre en pause' : 'Lire'} accessibilityRole="button">
              <Feather name={activePlaying ? 'pause' : 'play'} size={25} color={colors.primaryForeground} />
            </Pressable>
            <Pressable onPress={playNext} hitSlop={12} accessibilityLabel="Piste suivante" accessibilityRole="button">
              <Feather name="skip-forward" size={24} color={colors.foreground} />
            </Pressable>
            <View style={styles.repeatPill}>
              <Text style={[styles.repeatText, { color: colors.mutedForeground }]}>{repeatMode === 'one' ? '1' : repeatMode === 'all' ? '∞' : ''}</Text>
            </View>
          </View>
          <View style={[styles.details, { borderTopColor: colors.border }]}>
            <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>À PROPOS</Text>
            <Text style={[styles.description, { color: colors.foreground }]}>{current.description ?? 'Aucune description disponible pour ce média.'}</Text>
            {current.lyrics ? (
              <>
                <Text style={[styles.detailLabel, { color: colors.mutedForeground, marginTop: 24 }]}>PAROLES</Text>
                <Text style={[styles.lyrics, { color: colors.foreground }]}>{current.lyrics}</Text>
              </>
            ) : null}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topbar: { height: 70, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  topTitle: { fontSize: 11, letterSpacing: 2, fontFamily: 'Inter_600SemiBold' },
  content: { padding: 20, paddingBottom: 45 },
  video: { width: '100%', aspectRatio: 16 / 9, borderRadius: 20, overflow: 'hidden', justifyContent: 'center' },
  heroArt: { width: '100%', aspectRatio: 1, borderRadius: 28, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  glassIcon: { width: 64, height: 64, borderRadius: 99, backgroundColor: 'rgba(9,11,24,0.72)', alignItems: 'center', justifyContent: 'center' },
  loader: { ...StyleSheet.absoluteFillObject },
  info: { marginTop: 24 },
  title: { fontSize: 25, fontFamily: 'Inter_700Bold' },
  artist: { fontSize: 15, fontFamily: 'Inter_500Medium', marginTop: 7 },
  progressTrack: { height: 7, borderRadius: 4, marginTop: 26, overflow: 'hidden' },
  progress: { height: '100%', borderRadius: 4 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 7 },
  time: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 22, marginTop: 23 },
  mainPlay: { width: 62, height: 62, borderRadius: 99, alignItems: 'center', justifyContent: 'center' },
  repeatPill: { width: 21, alignItems: 'center' },
  repeatText: { fontSize: 12, fontFamily: 'Inter_700Bold' },
  details: { borderTopWidth: 1, marginTop: 32, paddingTop: 22 },
  detailLabel: { fontSize: 11, letterSpacing: 1.5, fontFamily: 'Inter_600SemiBold' },
  description: { fontSize: 15, lineHeight: 24, fontFamily: 'Inter_400Regular', marginTop: 10 },
  lyrics: { fontSize: 18, lineHeight: 31, fontFamily: 'Inter_500Medium', marginTop: 10 },
});
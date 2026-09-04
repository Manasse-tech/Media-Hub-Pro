import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import { isPictureInPictureSupported, VideoView, useVideoPlayer } from 'expo-video';
import { useEvent } from 'expo';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
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
    playbackVolume,
    playbackMuted,
    playbackRate,
    setPlaybackSnapshot,
    setPlaybackVolume,
    toggleMute,
    setPlaybackRate,
    registerSeekHandler,
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
  const videoViewRef = useRef<VideoView>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [volumeTrackWidth, setVolumeTrackWidth] = useState(1);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const pipAvailable = isPictureInPictureSupported();

  useEffect(() => {
    void setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'doNotMix',
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (current?.type !== 'audio' || !isVisible) {
      audioPlayer.clearLockScreenControls();
      return;
    }
    audioPlayer.setActiveForLockScreen(
      true,
      { title: current.title, artist: current.artist },
      { showSeekForward: true, showSeekBackward: true },
    );
    return () => audioPlayer.clearLockScreenControls();
  }, [audioPlayer, current, isVisible]);

  useEffect(() => {
    if (current?.type === 'audio') {
      audioPlayer.volume = playbackVolume;
      audioPlayer.muted = playbackMuted;
      audioPlayer.playbackRate = playbackRate;
    }
    if (current?.type === 'video') {
      videoPlayer.volume = playbackVolume;
      videoPlayer.muted = playbackMuted;
      videoPlayer.playbackRate = playbackRate;
    }
  }, [audioPlayer, current?.type, playbackMuted, playbackRate, playbackVolume, videoPlayer]);

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

  const seekToPosition = useCallback((nextPosition: number) => {
    if (current?.type === 'audio') {
      void audioPlayer.seekTo(nextPosition);
    } else if (current?.type === 'video') {
      videoPlayer.currentTime = nextPosition;
    }
  }, [audioPlayer, current?.type, videoPlayer]);

  useEffect(() => registerSeekHandler(seekToPosition), [registerSeekHandler, seekToPosition]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active' && current?.type === 'audio' && isVisible && isPlaying && audioPlayer.isLoaded) {
        void setAudioModeAsync({ shouldPlayInBackground: true }).catch(() => undefined);
        if (!audioPlayer.playing) audioPlayer.play();
      }
    });
    return () => subscription.remove();
  }, [audioPlayer, current?.type, isPlaying, isVisible]);

  useEffect(() => {
    if (audioStatus.didJustFinish && repeatMode === 'one') audioPlayer.seekTo(0);
    if (audioStatus.didJustFinish && repeatMode !== 'one') playNext();
  }, [audioStatus.didJustFinish, audioPlayer, playNext, repeatMode]);

  useEffect(() => {
    setPlaybackError(null);
    setShowSettings(false);
  }, [current?.id]);

  useEffect(() => {
    if (videoStatus.status === 'error') {
      setPlaybackError('Cette vidéo ne peut pas être décodée sur cet appareil ou son fichier est incomplet.');
    }
  }, [videoStatus.status]);

  const duration = current?.type === 'audio' ? audioStatus.duration : videoDuration;
  const position = current?.type === 'audio' ? audioStatus.currentTime : (videoTime?.currentTime ?? 0);
  const progress = duration > 0 ? Math.min(1, position / duration) : 0;
  const loading = current?.type === 'audio'
    ? !audioStatus.isLoaded && isVisible
    : videoStatus.status === 'loading' && isVisible;
  const activePlaying = current?.type === 'audio' ? audioStatus.playing : videoPlaying.isPlaying;
  const repeatIcon: keyof typeof Feather.glyphMap = repeatMode === 'one' ? 'repeat' : 'repeat';
  const [progressWidth, setProgressWidth] = useState(1);

  useEffect(() => {
    if (!current || !isVisible) {
      setPlaybackSnapshot(0, 0);
      return;
    }
    setPlaybackSnapshot(position, duration);
  }, [current, duration, isVisible, position, setPlaybackSnapshot]);

  const seek = (ratio: number) => {
    const nextPosition = Math.max(0, Math.min(duration || 0, (duration || 0) * ratio));
    seekToPosition(nextPosition);
  };

  const retryVideo = () => {
    if (current?.type !== 'video') return;
    setPlaybackError(null);
    videoPlayer.replace(current.uri);
    videoPlayer.play();
  };

  useEffect(() => {
    if (Platform.OS === 'web' || current?.type !== 'video' || !isVisible) return;
    const timeout = setTimeout(() => {
      void videoViewRef.current?.enterFullscreen().catch(() => undefined);
    }, 180);
    return () => clearTimeout(timeout);
  }, [current?.id, isVisible]);

  if (!current) return null;
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      onRequestClose={close}
      presentationStyle={current.type === 'video' ? 'fullScreen' : 'pageSheet'}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {current.type === 'video' ? (
          <View style={styles.videoStage}>
            <VideoView
              ref={videoViewRef}
              player={videoPlayer}
              style={StyleSheet.absoluteFill}
              contentFit="contain"
              nativeControls
              allowsFullscreen
              fullscreenOptions={{ enable: true, orientation: 'landscape' }}
              allowsPictureInPicture={pipAvailable}
              startsPictureInPictureAutomatically
            />
            {loading ? <ActivityIndicator size="large" color={colors.primary} style={StyleSheet.absoluteFill} /> : null}
            {playbackError ? (
              <View style={styles.videoError}>
                <Feather name="alert-circle" size={26} color={colors.accent} />
                <Text style={[styles.videoErrorTitle, { color: colors.foreground }]}>Lecture impossible</Text>
                <Text style={[styles.videoErrorText, { color: colors.mutedForeground }]}>{playbackError}</Text>
                <Pressable onPress={retryVideo} style={[styles.retryButton, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.retryText, { color: colors.primaryForeground }]}>Réessayer</Text>
                </Pressable>
              </View>
            ) : null}
            <View pointerEvents="box-none" style={styles.videoOverlay}>
              <View style={[styles.videoTopbar, { paddingTop: insets.top + 12 }]}>
                <Pressable testID="close-player" onPress={close} hitSlop={12} accessibilityLabel="Fermer le lecteur" accessibilityRole="button">
                  <Feather name="chevron-down" size={26} color={colors.foreground} />
                </Pressable>
                <Text numberOfLines={1} style={[styles.videoTopTitle, { color: colors.foreground }]}>{current.title}</Text>
                <Pressable onPress={() => toggleFavorite(current.id)} hitSlop={12} accessibilityLabel="Ajouter aux favoris" accessibilityRole="button">
                  <Feather name="heart" size={22} color={favorites.includes(current.id) ? colors.accent : colors.foreground} />
                </Pressable>
              </View>
              <View style={[styles.videoBottom, { paddingBottom: insets.bottom + 16 }]}>
                <Text numberOfLines={1} style={[styles.videoTitle, { color: colors.foreground }]}>{current.title}</Text>
                <Text numberOfLines={1} style={[styles.videoArtist, { color: colors.mutedForeground }]}>{current.artist}</Text>
                <View style={styles.videoTools}>
                  <Pressable onPress={toggleMute} hitSlop={10} accessibilityLabel={playbackMuted ? 'Réactiver le son' : 'Couper le son'}>
                    <Feather name={playbackMuted ? 'volume-x' : 'volume-2'} size={19} color={colors.foreground} />
                  </Pressable>
                  <Pressable onPress={() => setShowSettings((value) => !value)} style={[styles.speedButton, { borderColor: colors.border }]}>
                    <Text style={[styles.speedText, { color: colors.foreground }]}>{playbackRate}×</Text>
                  </Pressable>
                  {pipAvailable ? (
                    <Pressable onPress={() => void videoViewRef.current?.startPictureInPicture()} hitSlop={10} accessibilityLabel="Lecture dans une fenêtre">
                      <Feather name="external-link" size={18} color={colors.foreground} />
                    </Pressable>
                  ) : null}
                  <Pressable onPress={() => setShowSettings((value) => !value)} hitSlop={10} accessibilityLabel="Paramètres vidéo">
                    <Feather name="sliders" size={19} color={colors.foreground} />
                  </Pressable>
                </View>
                {showSettings ? (
                  <View style={[styles.settingsPanel, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.settingsLabel, { color: colors.mutedForeground }]}>VITESSE</Text>
                    <View style={styles.speedChoices}>
                      {[0.75, 1, 1.25, 1.5, 2].map((speed) => (
                        <Pressable key={speed} onPress={() => setPlaybackRate(speed)} style={[styles.speedChoice, { backgroundColor: playbackRate === speed ? colors.primary : colors.secondary }]}>
                          <Text style={[styles.speedChoiceText, { color: playbackRate === speed ? colors.primaryForeground : colors.foreground }]}>{speed}×</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        ) : (
          <>
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
            <View style={[styles.heroArt, { backgroundColor: colors.secondary }]}>
              {current.artwork ? <Image source={current.artwork} style={StyleSheet.absoluteFill} contentFit="cover" /> : null}
              <View style={styles.glassIcon}><Feather name="music" size={28} color={colors.primary} /></View>
              {loading ? <ActivityIndicator size="large" color={colors.primary} style={styles.loader} /> : null}
            </View>
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
              <View style={styles.toolRow}>
                <Pressable onPress={toggleMute} style={styles.toolButton} accessibilityLabel={playbackMuted ? 'Réactiver le son' : 'Couper le son'}>
                  <Feather name={playbackMuted ? 'volume-x' : 'volume-2'} size={18} color={colors.foreground} />
                  <Text style={[styles.toolText, { color: colors.foreground }]}>{playbackMuted ? 'Muet' : 'Son'}</Text>
                </Pressable>
                <Pressable onPress={() => setShowSettings((value) => !value)} style={[styles.toolButton, { borderColor: colors.border }]} accessibilityLabel="Paramètres audio">
                  <Feather name="sliders" size={17} color={colors.foreground} />
                  <Text style={[styles.toolText, { color: colors.foreground }]}>{playbackRate}×</Text>
                </Pressable>
              </View>
              {showSettings ? (
                <View style={[styles.settingsPanel, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.settingsLabel, { color: colors.mutedForeground }]}>VITESSE DE LECTURE</Text>
                  <View style={styles.speedChoices}>
                    {[0.75, 1, 1.25, 1.5, 2].map((speed) => (
                      <Pressable key={speed} onPress={() => setPlaybackRate(speed)} style={[styles.speedChoice, { backgroundColor: playbackRate === speed ? colors.primary : colors.secondary }]}>
                        <Text style={[styles.speedChoiceText, { color: playbackRate === speed ? colors.primaryForeground : colors.foreground }]}>{speed}×</Text>
                      </Pressable>
                    ))}
                  </View>
                  <Text style={[styles.settingsLabel, { color: colors.mutedForeground, marginTop: 16 }]}>VOLUME</Text>
                  <Pressable
                    accessibilityRole="adjustable"
                    accessibilityLabel="Volume"
                    onLayout={(event) => setVolumeTrackWidth(Math.max(event.nativeEvent.layout.width, 1))}
                    onPress={(event) => setPlaybackVolume(event.nativeEvent.locationX / volumeTrackWidth)}
                    style={[styles.volumeTrack, { backgroundColor: colors.secondary }]}
                  >
                    <View style={[styles.progress, { width: `${Math.round(playbackVolume * 100)}%`, backgroundColor: colors.primary }]} />
                  </Pressable>
                </View>
              ) : null}
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
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topbar: { height: 70, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  topTitle: { fontSize: 11, letterSpacing: 2, fontFamily: 'Inter_600SemiBold' },
  content: { padding: 20, paddingBottom: 45 },
  videoStage: { flex: 1, backgroundColor: '#000' },
  videoOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between' },
  videoTopbar: { paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.32)' },
  videoTopTitle: { flex: 1, fontSize: 14, textAlign: 'center', marginHorizontal: 18, fontFamily: 'Inter_600SemiBold' },
  videoBottom: { margin: 14, padding: 14, borderRadius: 16, backgroundColor: 'rgba(9,11,24,0.84)' },
  videoTitle: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  videoArtist: { fontSize: 12, marginTop: 4, fontFamily: 'Inter_400Regular' },
  videoTools: { flexDirection: 'row', alignItems: 'center', gap: 18, marginTop: 14 },
  videoError: { position: 'absolute', left: 26, right: 26, top: '36%', alignItems: 'center', padding: 20, borderRadius: 18, backgroundColor: 'rgba(9,11,24,0.92)' },
  videoErrorTitle: { fontSize: 16, marginTop: 10, fontFamily: 'Inter_700Bold' },
  videoErrorText: { fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 7, fontFamily: 'Inter_400Regular' },
  retryButton: { borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10, marginTop: 14 },
  retryText: { fontSize: 12, fontFamily: 'Inter_700Bold' },
  speedButton: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 5 },
  speedText: { fontSize: 12, fontFamily: 'Inter_700Bold' },
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
  toolRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 22 },
  toolButton: { minHeight: 38, borderWidth: 1, borderColor: 'transparent', borderRadius: 12, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 7 },
  toolText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  settingsPanel: { borderWidth: 1, borderRadius: 15, padding: 13, marginTop: 12 },
  settingsLabel: { fontSize: 10, letterSpacing: 1.4, fontFamily: 'Inter_700Bold' },
  speedChoices: { flexDirection: 'row', gap: 6, marginTop: 10 },
  speedChoice: { flex: 1, alignItems: 'center', borderRadius: 9, paddingVertical: 8 },
  speedChoiceText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  volumeTrack: { height: 6, borderRadius: 6, overflow: 'hidden', marginTop: 10 },
  details: { borderTopWidth: 1, marginTop: 32, paddingTop: 22 },
  detailLabel: { fontSize: 11, letterSpacing: 1.5, fontFamily: 'Inter_600SemiBold' },
  description: { fontSize: 15, lineHeight: 24, fontFamily: 'Inter_400Regular', marginTop: 10 },
  lyrics: { fontSize: 18, lineHeight: 31, fontFamily: 'Inter_500Medium', marginTop: 10 },
});
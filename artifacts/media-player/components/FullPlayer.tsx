import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import { VideoView, useVideoPlayer } from 'expo-video';
import React, { useEffect, useMemo, useRef } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { useMedia } from '@/context/MediaContext';

export function FullPlayer({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const colors = useColors();
  const { current, isPlaying, togglePlaying, toggleFavorite, favorites } = useMedia();
  const audioPlayer = useAudioPlayer(current?.type === 'audio' ? current.uri : null, { updateInterval: 250, keepAudioSessionActive: true });
  const audioStatus = useAudioPlayerStatus(audioPlayer);
  const videoPlayer = useVideoPlayer(current?.type === 'video' ? current.uri : null, (player) => {
    player.loop = false;
    player.showNowPlayingNotification = true;
  });
  const hasAppliedPlayState = useRef<string | null>(null);

  useEffect(() => {
    void setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true, interruptionMode: 'doNotMix' });
  }, []);

  useEffect(() => {
    if (!current || !visible) return;
    if (hasAppliedPlayState.current === current.id) return;
    hasAppliedPlayState.current = current.id;
    if (isPlaying) {
      if (current.type === 'audio') audioPlayer.play();
      else videoPlayer.play();
    }
  }, [current?.id, visible]);

  useEffect(() => {
    if (!current || !visible) return;
    if (current.type === 'audio') {
      if (isPlaying) audioPlayer.play();
      else audioPlayer.pause();
    } else {
      if (isPlaying) videoPlayer.play();
      else videoPlayer.pause();
    }
  }, [isPlaying, current?.type, visible]);

  const progress = useMemo(() => {
    if (!current) return 0;
    const duration = current.type === 'audio' ? audioStatus.duration : videoPlayer.duration;
    const position = current.type === 'audio' ? audioStatus.currentTime : videoPlayer.currentTime;
    return duration > 0 ? Math.min(1, position / duration) : 0;
  }, [current, audioStatus.duration, audioStatus.currentTime, videoPlayer.duration, videoPlayer.currentTime]);

  if (!current) return null;
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.topbar}>
          <Pressable testID="close-player" onPress={onClose} hitSlop={12}><Feather name="chevron-down" size={26} color={colors.foreground} /></Pressable>
          <Text style={[styles.topTitle, { color: colors.mutedForeground }]}>LECTEUR</Text>
          <Pressable onPress={() => toggleFavorite(current.id)} hitSlop={12}><Feather name="heart" size={22} color={favorites.includes(current.id) ? colors.accent : colors.foreground} /></Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {current.type === 'video' ? (
            <View style={[styles.video, { backgroundColor: colors.background }]}>
              <VideoView player={videoPlayer} style={StyleSheet.absoluteFill} contentFit="contain" nativeControls allowsFullscreen />
            </View>
          ) : (
            <View style={[styles.heroArt, { backgroundColor: colors.secondary }]}>
              {current.artwork ? <Image source={current.artwork} style={StyleSheet.absoluteFill} contentFit="cover" /> : null}
              <View style={styles.glassIcon}><Feather name="music" size={28} color={colors.primary} /></View>
            </View>
          )}
          <View style={styles.info}>
            <Text style={[styles.title, { color: colors.foreground }]}>{current.title}</Text>
            <Text style={[styles.artist, { color: colors.primary }]}>{current.artist}</Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: colors.secondary }]}>
            <View style={[styles.progress, { width: `${Math.round(progress * 100)}%`, backgroundColor: colors.primary }]} />
          </View>
          <View style={styles.controls}>
            <Pressable onPress={() => {}} hitSlop={12}><Feather name="skip-back" size={24} color={colors.foreground} /></Pressable>
            <Pressable testID="player-toggle" onPress={togglePlaying} style={[styles.mainPlay, { backgroundColor: colors.primary }]}>
              <Feather name={isPlaying ? 'pause' : 'play'} size={25} color={colors.primaryForeground} />
            </Pressable>
            <Pressable onPress={() => {}} hitSlop={12}><Feather name="skip-forward" size={24} color={colors.foreground} /></Pressable>
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
  video: { width: '100%', aspectRatio: 16 / 9, borderRadius: 20, overflow: 'hidden' },
  heroArt: { width: '100%', aspectRatio: 1, borderRadius: 28, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  glassIcon: { width: 64, height: 64, borderRadius: 99, backgroundColor: 'rgba(9,11,24,0.72)', alignItems: 'center', justifyContent: 'center' },
  info: { marginTop: 24 },
  title: { fontSize: 25, fontFamily: 'Inter_700Bold' },
  artist: { fontSize: 15, fontFamily: 'Inter_500Medium', marginTop: 7 },
  progressTrack: { height: 5, borderRadius: 4, marginTop: 26, overflow: 'hidden' },
  progress: { height: '100%', borderRadius: 4 },
  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 40, marginTop: 25 },
  mainPlay: { width: 62, height: 62, borderRadius: 99, alignItems: 'center', justifyContent: 'center' },
  details: { borderTopWidth: 1, marginTop: 32, paddingTop: 22 },
  detailLabel: { fontSize: 11, letterSpacing: 1.5, fontFamily: 'Inter_600SemiBold' },
  description: { fontSize: 15, lineHeight: 24, fontFamily: 'Inter_400Regular', marginTop: 10 },
  lyrics: { fontSize: 18, lineHeight: 31, fontFamily: 'Inter_500Medium', marginTop: 10 },
});
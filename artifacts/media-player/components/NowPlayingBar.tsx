import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { useMedia } from '@/context/MediaContext';

export function NowPlayingBar({ onOpen }: { onOpen: () => void }) {
  const colors = useColors();
  const {
    current,
    isPlaying,
    togglePlaying,
    playbackPosition,
    playbackDuration,
    playbackMuted,
    seekTo,
    toggleMute,
  } = useMedia();
  const [trackWidth, setTrackWidth] = useState(1);
  if (!current) return null;
  const progress = playbackDuration > 0 ? Math.min(1, playbackPosition / playbackDuration) : 0;
  return (
    <Pressable testID="now-playing-bar" onPress={onOpen} style={({ pressed }) => [styles.container, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.9 : 1 }]}>
      <View style={[styles.art, { backgroundColor: colors.secondary }]}>
        {current.artwork ? <Image source={current.artwork} style={StyleSheet.absoluteFill} contentFit="cover" /> : null}
      </View>
      <View style={styles.copy}>
        <Text numberOfLines={1} style={[styles.title, { color: colors.foreground }]}>{current.title}</Text>
        <Text numberOfLines={1} style={[styles.artist, { color: colors.mutedForeground }]}>{current.artist}</Text>
        <Pressable
          testID="now-playing-progress"
          accessibilityRole="adjustable"
          accessibilityLabel="Position de lecture"
          onLayout={(event) => setTrackWidth(Math.max(event.nativeEvent.layout.width, 1))}
          onPress={(event) => {
            event.stopPropagation();
            if (playbackDuration > 0) seekTo(playbackDuration * (event.nativeEvent.locationX / trackWidth));
          }}
          style={[styles.track, { backgroundColor: colors.secondary }]}
        >
          <View style={[styles.trackFill, { width: `${Math.round(progress * 100)}%`, backgroundColor: colors.primary }]} />
        </Pressable>
      </View>
      <Pressable
        testID="now-playing-mute"
        onPress={(event) => {
          event.stopPropagation();
          toggleMute();
        }}
        hitSlop={8}
        accessibilityLabel={playbackMuted ? 'Réactiver le son' : 'Couper le son'}
        accessibilityRole="button"
        style={styles.iconButton}
      >
        <Feather name={playbackMuted ? 'volume-x' : 'volume-2'} size={17} color={colors.mutedForeground} />
      </Pressable>
      <Pressable
        testID="now-playing-toggle"
        onPress={(event) => {
          event.stopPropagation();
          togglePlaying();
        }}
        hitSlop={10}
        style={[styles.play, { backgroundColor: colors.primary }]}
      >
        <Feather name={isPlaying ? 'pause' : 'play'} size={16} color={colors.primaryForeground} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { minHeight: 68, marginHorizontal: 16, marginBottom: 10, borderRadius: 18, borderWidth: 1, padding: 8, flexDirection: 'row', alignItems: 'center' },
  art: { width: 50, height: 50, borderRadius: 12, overflow: 'hidden' },
  copy: { flex: 1, paddingHorizontal: 11 },
  title: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  artist: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 3 },
  track: { height: 3, borderRadius: 3, overflow: 'hidden', marginTop: 7 },
  trackFill: { height: '100%', borderRadius: 3 },
  iconButton: { paddingHorizontal: 5 },
  play: { width: 38, height: 38, borderRadius: 99, alignItems: 'center', justifyContent: 'center' },
});
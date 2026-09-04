import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useMedia } from '@/context/MediaContext';

export default function PlaybackSettingsScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    repeatMode,
    toggleRepeat,
    queue,
    playbackVolume,
    playbackMuted,
    playbackRate,
    setPlaybackVolume,
    toggleMute,
    setPlaybackRate,
  } = useMedia();
  const [volumeWidth, setVolumeWidth] = useState(1);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: insets.top + 12, paddingBottom: 40 }}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
          <Text style={[styles.backText, { color: colors.foreground }]}>Paramètres</Text>
        </Pressable>
        <Text style={[styles.kicker, { color: colors.primary }]}>LECTEUR</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>Lecture</Text>

        <View style={[styles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.panelHeader}>
            <View style={[styles.icon, { backgroundColor: colors.secondary }]}>
              <Feather name={playbackMuted ? 'volume-x' : 'volume-2'} size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.optionTitle, { color: colors.foreground }]}>Son</Text>
              <Text style={[styles.detail, { color: colors.mutedForeground }]}>{playbackMuted ? 'Muet' : `${Math.round(playbackVolume * 100)} %`}</Text>
            </View>
            <Pressable onPress={toggleMute} style={[styles.smallButton, { borderColor: colors.border }]}>
              <Text style={[styles.smallButtonText, { color: colors.foreground }]}>{playbackMuted ? 'Activer' : 'Muet'}</Text>
            </Pressable>
          </View>
          <Pressable
            accessibilityRole="adjustable"
            accessibilityLabel="Volume par défaut"
            onLayout={(event) => setVolumeWidth(Math.max(event.nativeEvent.layout.width, 1))}
            onPress={(event) => setPlaybackVolume(event.nativeEvent.locationX / volumeWidth)}
            style={[styles.volumeTrack, { backgroundColor: colors.secondary }]}
          >
            <View style={[styles.volumeFill, { width: `${Math.round(playbackVolume * 100)}%`, backgroundColor: colors.primary }]} />
          </Pressable>
        </View>

        <View style={[styles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.settingsLabel, { color: colors.mutedForeground }]}>VITESSE</Text>
          <View style={styles.speedChoices}>
            {[0.75, 1, 1.25, 1.5, 2].map((speed) => (
              <Pressable key={speed} onPress={() => setPlaybackRate(speed)} style={[styles.speedChoice, { backgroundColor: playbackRate === speed ? colors.primary : colors.secondary }]}>
                <Text style={[styles.speedText, { color: playbackRate === speed ? colors.primaryForeground : colors.foreground }]}>{speed}×</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable onPress={toggleRepeat} style={[styles.option, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.icon, { backgroundColor: colors.secondary }]}><Feather name="repeat" size={18} color={colors.primary} /></View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.optionTitle, { color: colors.foreground }]}>Répétition</Text>
            <Text style={[styles.detail, { color: colors.mutedForeground }]}>{repeatMode === 'off' ? 'Désactivée' : repeatMode === 'all' ? 'Toute la file' : 'Titre en cours'}</Text>
          </View>
          <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
        </Pressable>

        <Pressable onPress={() => router.push('/queue')} style={[styles.option, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.icon, { backgroundColor: colors.secondary }]}><Feather name="list" size={18} color={colors.primary} /></View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.optionTitle, { color: colors.foreground }]}>File de lecture</Text>
            <Text style={[styles.detail, { color: colors.mutedForeground }]}>{queue.length ? `${queue.length} média${queue.length > 1 ? 's' : ''} en attente` : 'Aucune file active'}</Text>
          </View>
          <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 28 },
  backText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  kicker: { fontSize: 11, letterSpacing: 1.8, fontFamily: 'Inter_700Bold' },
  title: { fontSize: 29, marginTop: 7 },
  panel: { borderWidth: 1, borderRadius: 18, padding: 14, marginTop: 24 },
  panelHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  option: { minHeight: 70, borderWidth: 1, borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 },
  icon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  optionTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  detail: { fontSize: 12, marginTop: 3, fontFamily: 'Inter_400Regular' },
  smallButton: { borderWidth: 1, borderRadius: 9, paddingHorizontal: 10, paddingVertical: 7 },
  smallButtonText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  volumeTrack: { height: 7, borderRadius: 7, overflow: 'hidden', marginTop: 15 },
  volumeFill: { height: '100%', borderRadius: 7 },
  settingsLabel: { fontSize: 10, letterSpacing: 1.4, fontFamily: 'Inter_700Bold' },
  speedChoices: { flexDirection: 'row', gap: 6, marginTop: 11 },
  speedChoice: { flex: 1, alignItems: 'center', borderRadius: 9, paddingVertical: 9 },
  speedText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
});
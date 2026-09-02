import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useMedia } from '@/context/MediaContext';

export default function MediaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { library, favorites, toggleFavorite, openPlayer, removeFromLibrary } = useMedia();
  const item = library.find((media) => media.id === id);
  if (!item) return <View style={[styles.missing, { backgroundColor: colors.background }]}><Text style={[styles.title, { color: colors.foreground }]}>Média introuvable</Text><Pressable onPress={() => router.back()}><Text style={{ color: colors.primary }}>Retour</Text></Pressable></View>;
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: insets.top + 12, paddingBottom: 120 }}>
        <View style={styles.top}><Pressable onPress={() => router.back()}><Feather name="arrow-left" size={22} color={colors.foreground} /></Pressable><Pressable onPress={() => toggleFavorite(item.id)}><Feather name="heart" size={22} color={favorites.includes(item.id) ? colors.accent : colors.foreground} /></Pressable></View>
        <View style={[styles.art, { backgroundColor: colors.card }]}>{item.artwork ? <Image source={item.artwork} style={StyleSheet.absoluteFill} contentFit="cover" /> : <Feather name={item.type === 'video' ? 'video' : 'music'} size={34} color={colors.primary} />}</View>
        <Text style={[styles.type, { color: colors.primary }]}>{item.type === 'video' ? 'VIDÉO' : 'AUDIO'} · {item.isOnline ? 'EN LIGNE' : 'LOCAL'}</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>{item.title}</Text>
        <Text style={[styles.artist, { color: colors.mutedForeground }]}>{item.artist}</Text>
        <Pressable onPress={() => openPlayer(item)} style={[styles.play, { backgroundColor: colors.primary }]}><Feather name="play" size={17} color={colors.primaryForeground} /><Text style={[styles.playText, { color: colors.primaryForeground }]}>Lire maintenant</Text></Pressable>
        <View style={[styles.section, { borderTopColor: colors.border }]}><Text style={[styles.label, { color: colors.mutedForeground }]}>INFORMATIONS</Text><Text style={[styles.body, { color: colors.foreground }]}>{item.description ?? 'Aucune description disponible.'}</Text><Text style={[styles.meta, { color: colors.mutedForeground }]}>{item.size ? `${Math.round(item.size / 1024 / 1024 * 10) / 10} Mo` : 'Taille inconnue'} · {item.addedAt ? `Importé le ${new Date(item.addedAt).toLocaleDateString('fr-FR')}` : 'Date d’import inconnue'}</Text>{item.lyrics ? <><Text style={[styles.label, { color: colors.mutedForeground, marginTop: 24 }]}>PAROLES</Text><Text style={[styles.body, { color: colors.foreground }]}>{item.lyrics}</Text></> : null}</View>
        <Pressable onPress={() => Alert.alert('Supprimer ce média ?', 'Il sera retiré de la bibliothèque, des favoris et des playlists.', [{ text: 'Annuler', style: 'cancel' }, { text: 'Supprimer', style: 'destructive', onPress: () => { removeFromLibrary(item.id); router.back(); } }])} style={styles.delete}><Feather name="trash-2" size={16} color={colors.destructive} /><Text style={[styles.deleteText, { color: colors.destructive }]}>Retirer de la bibliothèque</Text></Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  missing: { flex: 1, padding: 30, justifyContent: 'center', alignItems: 'center', gap: 15 },
  top: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 22 },
  art: { width: '100%', aspectRatio: 1, borderRadius: 26, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  type: { fontSize: 10, letterSpacing: 1.6, marginTop: 24, fontFamily: 'Inter_700Bold' },
  title: { fontSize: 29, marginTop: 8, fontFamily: 'Inter_700Bold' },
  artist: { fontSize: 15, marginTop: 6, fontFamily: 'Inter_400Regular' },
  play: { height: 48, borderRadius: 15, marginTop: 23, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  playText: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  section: { borderTopWidth: 1, marginTop: 30, paddingTop: 22 },
  label: { fontSize: 11, letterSpacing: 1.5, fontFamily: 'Inter_600SemiBold' },
  body: { fontSize: 15, lineHeight: 24, marginTop: 10, fontFamily: 'Inter_400Regular' },
  meta: { fontSize: 11, marginTop: 12, fontFamily: 'Inter_400Regular' },
  delete: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 32, justifyContent: 'center' },
  deleteText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
});
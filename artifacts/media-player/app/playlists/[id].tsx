import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MediaCard } from '@/components/MediaCard';
import { useColors } from '@/hooks/useColors';
import { useMedia } from '@/context/MediaContext';

export default function PlaylistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { playlists, library, playQueue, openPlayer, addToPlaylist, removeFromPlaylist, movePlaylistItem, renamePlaylist, deletePlaylist } = useMedia();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const playlist = playlists.find((entry) => entry.id === id);
  const items = playlist ? playlist.itemIds.map((itemId) => library.find((item) => item.id === itemId)).filter((item): item is typeof library[number] => Boolean(item)) : [];
  if (!playlist) return <View style={[styles.missing, { backgroundColor: colors.background }]}><Text style={[styles.title, { color: colors.foreground }]}>Playlist introuvable</Text><Pressable onPress={() => router.back()}><Text style={{ color: colors.primary }}>Retour</Text></Pressable></View>;
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: insets.top + 12, paddingBottom: 120 }}>
        <View style={styles.top}><Pressable onPress={() => router.back()}><Feather name="arrow-left" size={22} color={colors.foreground} /></Pressable><Pressable onPress={() => Alert.alert('Supprimer cette playlist ?', 'Les médias ne seront pas supprimés.', [{ text: 'Annuler', style: 'cancel' }, { text: 'Supprimer', style: 'destructive', onPress: () => { deletePlaylist(playlist.id); router.back(); } }])}><Feather name="trash-2" size={19} color={colors.destructive} /></Pressable></View>
        <Text style={[styles.kicker, { color: colors.primary }]}>COLLECTION</Text>
        {editing ? <View style={styles.renameRow}><TextInput value={name} onChangeText={setName} autoFocus style={[styles.renameInput, { color: colors.foreground, borderColor: colors.border }]} /><Pressable onPress={() => { renamePlaylist(playlist.id, name); setEditing(false); }}><Feather name="check" size={20} color={colors.primary} /></Pressable></View> : <Pressable onPress={() => { setName(playlist.name); setEditing(true); }}><Text style={[styles.title, { color: colors.foreground }]}>{playlist.name}</Text></Pressable>}
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{items.length} média{items.length > 1 ? 's' : ''} disponible{items.length > 1 ? 's' : ''}</Text>
        {items.length ? <><Pressable onPress={() => playQueue(items)} style={[styles.play, { backgroundColor: colors.primary }]}><Feather name="play" size={16} color={colors.primaryForeground} /><Text style={[styles.playText, { color: colors.primaryForeground }]}>Lire la playlist</Text></Pressable>{items.map((item, index) => <View key={item.id} style={styles.playlistRow}><View style={{ flex: 1 }}><MediaCard item={item} compact onPress={() => openPlayer(item)} onRemove={() => removeFromPlaylist(playlist.id, item.id)} /></View><View style={styles.order}><Pressable onPress={() => movePlaylistItem(playlist.id, item.id, 'up')} hitSlop={8}><Feather name="chevron-up" size={16} color={index ? colors.foreground : colors.mutedForeground} /></Pressable><Pressable onPress={() => movePlaylistItem(playlist.id, item.id, 'down')} hitSlop={8}><Feather name="chevron-down" size={16} color={index < items.length - 1 ? colors.foreground : colors.mutedForeground} /></Pressable></View></View>)}</> : <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}><Feather name="list" size={24} color={colors.primary} /><Text style={[styles.emptyTitle, { color: colors.foreground }]}>Playlist vide</Text><Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Ajoutez des médias depuis l’onglet Playlists.</Text></View>}
        <Text style={[styles.addTitle, { color: colors.foreground }]}>Gérer les médias</Text>
        {library.map((item) => {
          const included = playlist.itemIds.includes(item.id);
          return <Pressable key={item.id} onPress={() => included ? removeFromPlaylist(playlist.id, item.id) : addToPlaylist(playlist.id, item.id)} style={[styles.addRow, { borderBottomColor: colors.border }]}><Feather name={included ? 'check-square' : 'square'} size={18} color={included ? colors.primary : colors.mutedForeground} /><Text numberOfLines={1} style={[styles.addText, { color: colors.foreground }]}>{item.title}</Text></Pressable>;
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  missing: { flex: 1, padding: 30, justifyContent: 'center', alignItems: 'center', gap: 15 },
  top: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  kicker: { fontSize: 11, letterSpacing: 1.8, fontFamily: 'Inter_700Bold' },
  title: { fontSize: 29, marginTop: 7, fontFamily: 'Inter_700Bold' },
  subtitle: { fontSize: 13, marginTop: 7, marginBottom: 20, fontFamily: 'Inter_400Regular' },
  play: { height: 48, borderRadius: 15, marginBottom: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  playText: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  empty: { borderWidth: 1, borderRadius: 20, padding: 25, alignItems: 'center', gap: 9 },
  emptyTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  emptyText: { fontSize: 12, textAlign: 'center', fontFamily: 'Inter_400Regular' },
  addTitle: { fontSize: 17, marginTop: 28, marginBottom: 10, fontFamily: 'Inter_700Bold' },
  addRow: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1 },
  addText: { flex: 1, fontSize: 13, fontFamily: 'Inter_500Medium' },
  renameRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 7 },
  renameInput: { flex: 1, height: 44, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, fontSize: 17, fontFamily: 'Inter_600SemiBold' },
  playlistRow: { flexDirection: 'row', alignItems: 'center' },
  order: { width: 24, alignItems: 'center', gap: 9 },
});
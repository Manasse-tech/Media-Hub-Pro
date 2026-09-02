import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useMedia } from '@/context/MediaContext';
import { MediaCard } from '@/components/MediaCard';

export default function PlaylistsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { playlists, library, createPlaylist, openPlayer, addToPlaylist, removeFromPlaylist, deletePlaylist } = useMedia();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);

  const save = () => {
    createPlaylist(name);
    setName('');
    setModalVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 14, paddingBottom: 128 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.kicker, { color: colors.primary }]}>ORGANISER</Text>
            <Text style={[styles.title, { color: colors.foreground }]}>Playlists</Text>
          </View>
          <Pressable testID="new-playlist" onPress={() => setModalVisible(true)} style={[styles.add, { backgroundColor: colors.primary }]}>
            <Feather name="plus" size={19} color={colors.primaryForeground} />
          </Pressable>
        </View>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Vos sélections, accessibles même sans réseau.</Text>
        {playlists.length ? playlists.map((playlist) => (
          <Pressable key={playlist.id} onPress={() => { setSelectedPlaylist(selectedPlaylist === playlist.id ? null : playlist.id); router.push(`/playlists/${playlist.id}`); }} style={[styles.playlist, { backgroundColor: colors.card, borderColor: selectedPlaylist === playlist.id ? colors.primary : colors.border }]}>
            <View style={[styles.playlistArt, { backgroundColor: colors.secondary }]}><Feather name="music" size={22} color={colors.primary} /></View>
            <View style={styles.playlistCopy}>
              <Text style={[styles.playlistName, { color: colors.foreground }]}>{playlist.name}</Text>
              <Text style={[styles.playlistMeta, { color: colors.mutedForeground }]}>{playlist.itemIds.length} média{playlist.itemIds.length > 1 ? 's' : ''}</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
          </Pressable>
        )) : (
          <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="list" size={23} color={colors.primary} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Créez votre première playlist</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Regroupez les titres et vidéos que vous aimez.</Text>
            <Pressable onPress={() => setModalVisible(true)} style={[styles.emptyButton, { backgroundColor: colors.primary }]}><Text style={[styles.emptyButtonText, { color: colors.primaryForeground }]}>Nouvelle playlist</Text></Pressable>
          </View>
        )}
        {selectedPlaylist ? (
          <View style={[styles.managePanel, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.manageHeader}>
              <Text style={[styles.section, { color: colors.foreground, marginTop: 0, marginBottom: 0 }]}>Contenu de la playlist</Text>
              <Pressable onPress={() => { deletePlaylist(selectedPlaylist); setSelectedPlaylist(null); }} hitSlop={10}><Feather name="trash-2" size={17} color={colors.destructive} /></Pressable>
            </View>
            {library.map((item) => {
              const playlist = playlists.find((entry) => entry.id === selectedPlaylist);
              const included = Boolean(playlist?.itemIds.includes(item.id));
              return (
                <Pressable key={item.id} onPress={() => included ? removeFromPlaylist(selectedPlaylist, item.id) : addToPlaylist(selectedPlaylist, item.id)} style={styles.addRow}>
                  <View style={[styles.checkbox, { borderColor: included ? colors.primary : colors.border, backgroundColor: included ? colors.primary : 'transparent' }]}>
                    {included ? <Feather name="check" size={13} color={colors.primaryForeground} /> : null}
                  </View>
                  <Text numberOfLines={1} style={[styles.addRowText, { color: colors.foreground }]}>{item.title}</Text>
                  <Text style={[styles.addRowMeta, { color: colors.mutedForeground }]}>{item.type === 'video' ? 'Vidéo' : 'Audio'}</Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}
        <Text style={[styles.section, { color: colors.foreground }]}>Ajouter depuis la bibliothèque</Text>
        {library.slice(0, 3).map((item) => <MediaCard key={item.id} item={item} compact onPress={() => openPlayer(item)} />)}
      </ScrollView>
      <Modal visible={modalVisible} animationType="fade" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.overlay}><View style={[styles.dialog, { backgroundColor: colors.card }]}>
          <View style={styles.dialogHeader}><Text style={[styles.dialogTitle, { color: colors.foreground }]}>Nouvelle playlist</Text><Pressable onPress={() => setModalVisible(false)}><Feather name="x" size={20} color={colors.foreground} /></Pressable></View>
          <TextInput autoFocus value={name} onChangeText={setName} placeholder="Ex. Trajets du soir" placeholderTextColor={colors.mutedForeground} style={[styles.dialogInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]} />
          <Pressable onPress={save} disabled={!name.trim()} style={[styles.save, { backgroundColor: colors.primary, opacity: name.trim() ? 1 : 0.45 }]}><Text style={[styles.emptyButtonText, { color: colors.primaryForeground }]}>Créer</Text></Pressable>
        </View></View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  kicker: { fontSize: 11, letterSpacing: 1.8, fontFamily: 'Inter_700Bold' },
  title: { fontSize: 28, marginTop: 7, fontFamily: 'Inter_700Bold' },
  add: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  subtitle: { fontSize: 13, marginTop: 8, marginBottom: 22, fontFamily: 'Inter_400Regular' },
  playlist: { padding: 12, borderWidth: 1, borderRadius: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  playlistArt: { width: 54, height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  playlistCopy: { flex: 1, marginLeft: 12 },
  playlistName: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  playlistMeta: { fontSize: 12, marginTop: 4, fontFamily: 'Inter_400Regular' },
  empty: { borderWidth: 1, borderRadius: 20, padding: 24, alignItems: 'center' },
  emptyTitle: { fontSize: 15, marginTop: 11, fontFamily: 'Inter_600SemiBold' },
  emptyText: { fontSize: 12, marginTop: 5, fontFamily: 'Inter_400Regular' },
  emptyButton: { height: 42, borderRadius: 13, paddingHorizontal: 16, justifyContent: 'center', marginTop: 18 },
  emptyButtonText: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  section: { fontSize: 17, marginTop: 30, marginBottom: 13, fontFamily: 'Inter_700Bold' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.58)', justifyContent: 'center', padding: 20 },
  dialog: { borderRadius: 22, padding: 20 },
  dialogHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dialogTitle: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  dialogInput: { height: 52, borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, marginTop: 18, fontSize: 14, fontFamily: 'Inter_400Regular' },
  save: { height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  managePanel: { borderWidth: 1, borderRadius: 18, padding: 14, marginBottom: 5 },
  manageHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addRow: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  checkbox: { width: 22, height: 22, borderRadius: 7, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  addRowText: { flex: 1, fontSize: 13, fontFamily: 'Inter_500Medium' },
  addRowMeta: { fontSize: 11, fontFamily: 'Inter_400Regular' },
});
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useMedia } from '@/context/MediaContext';
import { MediaCard } from '@/components/MediaCard';
import { FullPlayer } from '@/components/FullPlayer';

export default function PlaylistsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { playlists, library, createPlaylist, setCurrent } = useMedia();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [playerVisible, setPlayerVisible] = useState(false);

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
          <View key={playlist.id} style={[styles.playlist, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.playlistArt, { backgroundColor: colors.secondary }]}><Feather name="music" size={22} color={colors.primary} /></View>
            <View style={styles.playlistCopy}>
              <Text style={[styles.playlistName, { color: colors.foreground }]}>{playlist.name}</Text>
              <Text style={[styles.playlistMeta, { color: colors.mutedForeground }]}>{playlist.itemIds.length} média{playlist.itemIds.length > 1 ? 's' : ''}</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
          </View>
        )) : (
          <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="list" size={23} color={colors.primary} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Créez votre première playlist</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Regroupez les titres et vidéos que vous aimez.</Text>
            <Pressable onPress={() => setModalVisible(true)} style={[styles.emptyButton, { backgroundColor: colors.primary }]}><Text style={[styles.emptyButtonText, { color: colors.primaryForeground }]}>Nouvelle playlist</Text></Pressable>
          </View>
        )}
        <Text style={[styles.section, { color: colors.foreground }]}>Ajouter depuis la bibliothèque</Text>
        {library.slice(0, 3).map((item) => <MediaCard key={item.id} item={item} compact onPress={() => { setCurrent(item); setPlayerVisible(true); }} />)}
      </ScrollView>
      <Modal visible={modalVisible} animationType="fade" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.overlay}><View style={[styles.dialog, { backgroundColor: colors.card }]}>
          <View style={styles.dialogHeader}><Text style={[styles.dialogTitle, { color: colors.foreground }]}>Nouvelle playlist</Text><Pressable onPress={() => setModalVisible(false)}><Feather name="x" size={20} color={colors.foreground} /></Pressable></View>
          <TextInput autoFocus value={name} onChangeText={setName} placeholder="Ex. Trajets du soir" placeholderTextColor={colors.mutedForeground} style={[styles.dialogInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]} />
          <Pressable onPress={save} disabled={!name.trim()} style={[styles.save, { backgroundColor: colors.primary, opacity: name.trim() ? 1 : 0.45 }]}><Text style={[styles.emptyButtonText, { color: colors.primaryForeground }]}>Créer</Text></Pressable>
        </View></View>
      </Modal>
      <FullPlayer visible={playerVisible} onClose={() => setPlayerVisible(false)} />
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
});
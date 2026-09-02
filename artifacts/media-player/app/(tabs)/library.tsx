import * as DocumentPicker from 'expo-document-picker';
import { Feather } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useMedia, type LocalMedia } from '@/context/MediaContext';
import { MediaCard } from '@/components/MediaCard';

export default function LibraryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { library, favorites, addManyToLibrary, openPlayer, toggleFavorite } = useMedia();
  const [filter, setFilter] = useState<'all' | 'audio' | 'video' | 'favorites'>('all');
  const visibleItems = useMemo(() => library.filter((item) => filter === 'all' || filter === item.type || (filter === 'favorites' && favorites.includes(item.id))), [library, filter, favorites]);

  const importMedia = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['audio/*', 'video/*'],
      multiple: true,
      copyToCacheDirectory: true,
    });
    if (result.canceled) return;
    addManyToLibrary(result.assets.map((asset) => {
      const isVideo = asset.mimeType?.startsWith('video/') || /\.(mp4|mov|mkv|webm)$/i.test(asset.name);
      return {
        id: `local-${asset.uri}`,
        title: asset.name.replace(/\.[^/.]+$/, ''),
        artist: 'Fichier local',
        type: isVideo ? 'video' : 'audio',
        uri: asset.uri,
        description: `Importé depuis votre appareil · ${asset.name}`,
        isOnline: false,
          size: asset.size,
        addedAt: new Date().toISOString(),
      } satisfies LocalMedia;
    }));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 14, paddingBottom: 128 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.kicker, { color: colors.primary }]}>VOTRE COLLECTION</Text>
            <Text style={[styles.title, { color: colors.foreground }]}>Bibliothèque</Text>
          </View>
          <Pressable testID="import-media" onPress={importMedia} style={[styles.importButton, { backgroundColor: colors.primary }]}>
            <Feather name="plus" size={18} color={colors.primaryForeground} />
            <Text style={[styles.importText, { color: colors.primaryForeground }]}>Importer</Text>
          </Pressable>
        </View>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{library.length} médias disponibles sur cet appareil</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {(['all', 'audio', 'video', 'favorites'] as const).map((value) => (
            <Pressable key={value} onPress={() => setFilter(value)} style={[styles.filter, { backgroundColor: filter === value ? colors.primary : colors.card, borderColor: filter === value ? colors.primary : colors.border }]}>
              <Text style={[styles.filterText, { color: filter === value ? colors.primaryForeground : colors.mutedForeground }]}>{value === 'all' ? 'Tout' : value === 'audio' ? 'Musique' : value === 'video' ? 'Vidéos' : 'Favoris'}</Text>
            </Pressable>
          ))}
        </ScrollView>
        {visibleItems.length ? visibleItems.map((item) => (
          <MediaCard
            key={item.id}
            item={item}
            compact
            onPress={() => openPlayer(item)}
            onFavorite={() => toggleFavorite(item.id)}
            favorite={favorites.includes(item.id)}
            onDetails={() => router.push(`/media/${item.id}`)}
          />
        )) : (
          <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="folder" size={23} color={colors.primary} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Aucun média dans cette vue.</Text>
          </View>
        )}
        {library.some((item) => item.id.startsWith('local-')) ? (
          <Pressable onPress={() => Alert.alert('Fichiers locaux', 'Les fichiers importés restent sur cet appareil et ne sont pas envoyés automatiquement dans le cloud.')} style={styles.info}>
            <Feather name="shield" size={15} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.mutedForeground }]}>Vos fichiers locaux restent privés sur l’appareil.</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  kicker: { fontSize: 11, letterSpacing: 1.7, fontFamily: 'Inter_700Bold' },
  title: { fontSize: 28, marginTop: 7, fontFamily: 'Inter_700Bold' },
  subtitle: { marginHorizontal: 20, marginTop: 8, fontSize: 13, fontFamily: 'Inter_400Regular' },
  importButton: { height: 40, borderRadius: 13, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 6 },
  importText: { fontSize: 12, fontFamily: 'Inter_700Bold' },
  filters: { paddingHorizontal: 20, gap: 8, marginTop: 22, marginBottom: 18 },
  filter: { borderWidth: 1, borderRadius: 99, paddingVertical: 9, paddingHorizontal: 14 },
  filterText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  empty: { margin: 20, borderWidth: 1, borderRadius: 18, padding: 20, alignItems: 'center', gap: 10 },
  emptyText: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  info: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 20, marginTop: 10 },
  infoText: { fontSize: 11, fontFamily: 'Inter_400Regular' },
});
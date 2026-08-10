import { Feather } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useMedia } from '@/context/MediaContext';
import { MediaCard } from '@/components/MediaCard';
import { FullPlayer } from '@/components/FullPlayer';

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { library, setCurrent, favorites, toggleFavorite } = useMedia();
  const [query, setQuery] = useState('');
  const [playerVisible, setPlayerVisible] = useState(false);
  const results = useMemo(() => query.trim() ? library.filter((item) => `${item.title} ${item.artist}`.toLowerCase().includes(query.toLowerCase())) : library, [library, query]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 14, paddingBottom: 128 }} showsVerticalScrollIndicator={false}>
        <Text style={[styles.kicker, { color: colors.primary }]}>DÉCOUVRIR</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>Rechercher</Text>
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="search" size={18} color={colors.mutedForeground} />
          <TextInput
            testID="media-search"
            value={query}
            onChangeText={setQuery}
            placeholder="Titre, artiste ou fichier"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { color: colors.foreground }]}
            autoCorrect={false}
          />
          {query ? <Pressable onPress={() => setQuery('')} hitSlop={10}><Feather name="x-circle" size={17} color={colors.mutedForeground} /></Pressable> : null}
        </View>
        <View style={styles.resultHeader}>
          <Text style={[styles.resultTitle, { color: colors.foreground }]}>{query ? `${results.length} résultat${results.length > 1 ? 's' : ''}` : 'Votre collection'}</Text>
          <Text style={[styles.resultMeta, { color: colors.mutedForeground }]}>Sources autorisées uniquement</Text>
        </View>
        {results.length ? results.map((item) => (
          <MediaCard key={item.id} item={item} compact onPress={() => { setCurrent(item); setPlayerVisible(true); }} onFavorite={() => toggleFavorite(item.id)} favorite={favorites.includes(item.id)} />
        )) : (
          <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="search" size={22} color={colors.primary} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Aucun résultat</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Essayez un autre titre ou importez un fichier depuis la bibliothèque.</Text>
          </View>
        )}
        <View style={[styles.notice, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="check-circle" size={17} color={colors.primary} />
          <Text style={[styles.noticeText, { color: colors.mutedForeground }]}>Les sources externes seront ajoutées uniquement via des intégrations officielles et conformes à leurs conditions.</Text>
        </View>
      </ScrollView>
      <FullPlayer visible={playerVisible} onClose={() => setPlayerVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  kicker: { fontSize: 11, letterSpacing: 1.8, fontFamily: 'Inter_700Bold' },
  title: { fontSize: 28, marginTop: 7, fontFamily: 'Inter_700Bold' },
  searchBox: { height: 52, borderWidth: 1, borderRadius: 16, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', marginTop: 22 },
  input: { flex: 1, marginHorizontal: 10, fontSize: 14, fontFamily: 'Inter_400Regular' },
  resultHeader: { marginTop: 28, marginBottom: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  resultTitle: { fontSize: 17, fontFamily: 'Inter_700Bold' },
  resultMeta: { fontSize: 10, fontFamily: 'Inter_400Regular' },
  empty: { borderWidth: 1, borderRadius: 18, padding: 23, alignItems: 'center', gap: 8 },
  emptyTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  emptyText: { fontSize: 12, lineHeight: 18, textAlign: 'center', fontFamily: 'Inter_400Regular' },
  notice: { borderWidth: 1, borderRadius: 16, padding: 14, flexDirection: 'row', gap: 9, marginTop: 18 },
  noticeText: { flex: 1, fontSize: 11, lineHeight: 17, fontFamily: 'Inter_400Regular' },
});
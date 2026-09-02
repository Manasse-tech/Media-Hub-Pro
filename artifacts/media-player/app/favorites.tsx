import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MediaCard } from '@/components/MediaCard';
import { useColors } from '@/hooks/useColors';
import { useMedia } from '@/context/MediaContext';

export default function FavoritesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { library, favorites, openPlayer, toggleFavorite } = useMedia();
  const items = library.filter((item) => favorites.includes(item.id));
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: insets.top + 12, paddingBottom: 120 }}>
        <Pressable onPress={() => router.back()} style={styles.back}><Feather name="arrow-left" size={20} color={colors.foreground} /><Text style={[styles.backText, { color: colors.foreground }]}>Retour</Text></Pressable>
        <Text style={[styles.kicker, { color: colors.primary }]}>VOTRE ESPACE</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>Favoris</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{items.length} média{items.length > 1 ? 's' : ''} enregistré{items.length > 1 ? 's' : ''}</Text>
        {items.length ? items.map((item) => <MediaCard key={item.id} item={item} compact onPress={() => openPlayer(item)} onFavorite={() => toggleFavorite(item.id)} favorite onDetails={() => router.push(`/media/${item.id}`)} />) : (
          <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="heart" size={24} color={colors.primary} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Aucun favori pour le moment</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Touchez le cœur d’un média pour le retrouver ici.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 28 },
  backText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  kicker: { fontSize: 11, letterSpacing: 1.8, fontFamily: 'Inter_700Bold' },
  title: { fontSize: 29, marginTop: 7, fontFamily: 'Inter_700Bold' },
  subtitle: { fontSize: 13, marginTop: 7, marginBottom: 22, fontFamily: 'Inter_400Regular' },
  empty: { borderWidth: 1, borderRadius: 20, padding: 26, alignItems: 'center', gap: 9, marginTop: 10 },
  emptyTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  emptyText: { fontSize: 12, textAlign: 'center', lineHeight: 18, fontFamily: 'Inter_400Regular' },
});
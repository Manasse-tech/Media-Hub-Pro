import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MediaCard } from '@/components/MediaCard';
import { useColors } from '@/hooks/useColors';
import { useMedia } from '@/context/MediaContext';

export default function HistoryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { history, openPlayer, clearHistory } = useMedia();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: insets.top + 12, paddingBottom: 120 }}>
        <View style={styles.top}>
          <Pressable onPress={() => router.back()} style={styles.back}><Feather name="arrow-left" size={20} color={colors.foreground} /><Text style={[styles.backText, { color: colors.foreground }]}>Retour</Text></Pressable>
          {history.length ? <Pressable onPress={() => Alert.alert('Effacer l’historique ?', 'Cette action supprimera l’historique local de cet appareil.', [{ text: 'Annuler', style: 'cancel' }, { text: 'Effacer', style: 'destructive', onPress: clearHistory }])}><Text style={[styles.clear, { color: colors.destructive }]}>Effacer</Text></Pressable> : null}
        </View>
        <Text style={[styles.kicker, { color: colors.primary }]}>VOTRE ESPACE</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>Historique</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Vos 30 dernières lectures</Text>
        {history.length ? history.map((item) => <MediaCard key={item.id} item={item} compact onPress={() => openPlayer(item)} onDetails={() => router.push(`/media/${item.id}`)} />) : (
          <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}><Feather name="clock" size={24} color={colors.primary} /><Text style={[styles.emptyTitle, { color: colors.foreground }]}>Historique vide</Text><Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Les médias lus apparaîtront ici.</Text></View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  clear: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  kicker: { fontSize: 11, letterSpacing: 1.8, fontFamily: 'Inter_700Bold' },
  title: { fontSize: 29, marginTop: 7, fontFamily: 'Inter_700Bold' },
  subtitle: { fontSize: 13, marginTop: 7, marginBottom: 22, fontFamily: 'Inter_400Regular' },
  empty: { borderWidth: 1, borderRadius: 20, padding: 26, alignItems: 'center', gap: 9 },
  emptyTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  emptyText: { fontSize: 12, fontFamily: 'Inter_400Regular' },
});
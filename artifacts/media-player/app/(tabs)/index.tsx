import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth, useUser } from '@clerk/expo';
import { useColors } from '@/hooks/useColors';
import { useMedia } from '@/context/MediaContext';
import { MediaCard } from '@/components/MediaCard';

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { library, history, favorites, openPlayer, toggleFavorite } = useMedia();
  const [showAccount, setShowAccount] = useState(false);
  const featured = library[2] ?? library[0];
  const audio = useMemo(() => library.filter((item) => item.type === 'audio'), [library]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 128 }}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.kicker, { color: colors.primary }]}>BONJOUR{user?.firstName ? `, ${user.firstName.toUpperCase()}` : ''}</Text>
            <Text style={[styles.heading, { color: colors.foreground }]}>Qu’est-ce qu’on lit ?</Text>
          </View>
          <Pressable testID="account-button" onPress={() => setShowAccount((value) => !value)} style={[styles.avatar, { backgroundColor: colors.accent }]}>
            <Text style={[styles.avatarText, { color: colors.accentForeground }]}>{user?.firstName?.slice(0, 1).toUpperCase() ?? 'M'}</Text>
          </Pressable>
        </View>
        {showAccount ? (
          <View style={[styles.accountPanel, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.accountTitle, { color: colors.foreground }]}>{isSignedIn ? user?.primaryEmailAddress?.emailAddress ?? 'Compte connecté' : 'Mode invité'}</Text>
            <Text style={[styles.accountText, { color: colors.mutedForeground }]}>{isSignedIn ? 'Vos playlists et favoris sont synchronisés.' : 'La lecture locale reste disponible sans compte.'}</Text>
             <Pressable onPress={() => router.push(isSignedIn ? '/settings' : '/(auth)/sign-in')} style={styles.accountAction}>
               <Feather name={isSignedIn ? 'settings' : 'log-in'} size={15} color={colors.primary} />
               <Text style={[styles.accountActionText, { color: colors.primary }]}>{isSignedIn ? 'Gérer le compte' : 'Se connecter pour synchroniser'}</Text>
            </Pressable>
          </View>
        ) : null}
        <View style={styles.heroWrap}>
          <Image source={featured?.artwork} style={styles.heroImage} contentFit="cover" />
          <LinearGradient colors={['transparent', 'rgba(9,11,24,0.95)']} style={StyleSheet.absoluteFill} />
          <View style={styles.heroCopy}>
            <Text style={styles.heroEyebrow}>À LA UNE · {featured?.type === 'video' ? 'FILM' : 'AUDIO'}</Text>
            <Text style={styles.heroTitle}>{featured?.title ?? 'Votre prochaine écoute'}</Text>
            <Text style={styles.heroArtist}>{featured?.artist ?? 'Sélection Media Player'}</Text>
            <Pressable testID="featured-play" onPress={() => featured && openPlayer(featured)} style={[styles.heroButton, { backgroundColor: colors.primary }]}>
              <Feather name="play" size={15} color={colors.primaryForeground} />
              <Text style={[styles.heroButtonText, { color: colors.primaryForeground }]}>Lire maintenant</Text>
            </Pressable>
          </View>
        </View>
        <SectionHeader title="Repris récemment" colors={colors} />
        {history.length ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
            {history.map((item) => <MediaCard key={item.id} item={item} onPress={() => openPlayer(item)} />)}
          </ScrollView>
        ) : (
          <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="clock" size={20} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Votre historique apparaîtra ici</Text>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Lancez un titre ou une vidéo pour le retrouver facilement.</Text>
            </View>
          </View>
        )}
        <SectionHeader title="Pour vous" colors={colors} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {audio.map((item) => <MediaCard key={item.id} item={item} onPress={() => openPlayer(item)} onFavorite={() => toggleFavorite(item.id)} favorite={favorites.includes(item.id)} />)}
        </ScrollView>
        <SectionHeader title="Votre espace" colors={colors} />
        <View style={styles.quickRow}>
          <QuickAction icon="download-cloud" label="Importer" colors={colors} onPress={() => router.push('/library')} />
           <QuickAction icon="heart" label={`${favorites.length} favoris`} colors={colors} onPress={() => router.push('/favorites')} />
          <QuickAction icon="list" label="Playlists" colors={colors} onPress={() => router.push('/playlists')} />
        </View>
      </ScrollView>
    </View>
  );
}

function SectionHeader({ title, colors }: { title: string; colors: ReturnType<typeof useColors> }) {
  return <View style={styles.sectionHeader}><Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text></View>;
}

function QuickAction({ icon, label, colors, onPress }: { icon: keyof typeof Feather.glyphMap; label: string; colors: ReturnType<typeof useColors>; onPress: () => void }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.quickAction, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.75 : 1 }]}><Feather name={icon} size={18} color={colors.primary} /><Text style={[styles.quickText, { color: colors.foreground }]}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kicker: { fontSize: 11, letterSpacing: 1.9, fontFamily: 'Inter_700Bold' },
  heading: { fontSize: 25, marginTop: 6, fontFamily: 'Inter_700Bold' },
  avatar: { width: 42, height: 42, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  accountPanel: { marginHorizontal: 20, marginTop: 16, padding: 15, borderRadius: 18, borderWidth: 1 },
  accountTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  accountText: { fontSize: 12, lineHeight: 18, marginTop: 4, fontFamily: 'Inter_400Regular' },
  accountAction: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 12 },
  accountActionText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  heroWrap: { height: 310, borderRadius: 26, overflow: 'hidden', marginHorizontal: 20, marginTop: 24, position: 'relative' },
  heroImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  heroCopy: { position: 'absolute', left: 20, right: 20, bottom: 20 },
  heroEyebrow: { color: '#b9c5e1', fontSize: 10, letterSpacing: 1.5, fontFamily: 'Inter_700Bold' },
  heroTitle: { color: '#fff', fontSize: 29, marginTop: 7, fontFamily: 'Inter_700Bold' },
  heroArtist: { color: '#d4daf0', fontSize: 13, marginTop: 4, fontFamily: 'Inter_400Regular' },
  heroButton: { borderRadius: 13, height: 42, paddingHorizontal: 15, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 15 },
  heroButtonText: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  sectionHeader: { paddingHorizontal: 20, marginTop: 28, marginBottom: 13 },
  sectionTitle: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  row: { paddingLeft: 20, paddingRight: 8 },
  empty: { marginHorizontal: 20, borderWidth: 1, borderRadius: 18, padding: 15, flexDirection: 'row', gap: 13, alignItems: 'center' },
  emptyTitle: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  emptyText: { fontSize: 12, lineHeight: 18, marginTop: 3, fontFamily: 'Inter_400Regular' },
  quickRow: { paddingHorizontal: 20, flexDirection: 'row', gap: 8 },
  quickAction: { flex: 1, borderRadius: 16, borderWidth: 1, paddingVertical: 14, paddingHorizontal: 10, alignItems: 'center', gap: 8 },
  quickText: { fontSize: 11, textAlign: 'center', fontFamily: 'Inter_600SemiBold' },
});

import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth, useUser } from '@clerk/expo';
import { useColors } from '@/hooks/useColors';
import { useMedia } from '@/context/MediaContext';

function Row({ icon, title, detail, onPress, colors }: { icon: keyof typeof Feather.glyphMap; title: string; detail: string; onPress: () => void; colors: ReturnType<typeof useColors> }) {
  return <Pressable onPress={onPress} style={[styles.row, { borderBottomColor: colors.border }]}><View style={[styles.rowIcon, { backgroundColor: colors.secondary }]}><Feather name={icon} size={17} color={colors.primary} /></View><View style={styles.rowCopy}><Text style={[styles.rowTitle, { color: colors.foreground }]}>{title}</Text><Text style={[styles.rowDetail, { color: colors.mutedForeground }]}>{detail}</Text></View><Feather name="chevron-right" size={18} color={colors.mutedForeground} /></Pressable>;
}

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { library, favorites, playlists, isSyncing, syncError } = useMedia();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: insets.top + 12, paddingBottom: 120 }}>
        <Pressable onPress={() => router.back()} style={styles.back}><Feather name="arrow-left" size={20} color={colors.foreground} /><Text style={[styles.backText, { color: colors.foreground }]}>Retour</Text></Pressable>
        <Text style={[styles.kicker, { color: colors.primary }]}>CONFIGURATION</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>Paramètres</Text>
        <Pressable onPress={() => router.push('/settings/account')} style={[styles.profile, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.avatar, { backgroundColor: colors.accent }]}><Text style={[styles.avatarText, { color: colors.accentForeground }]}>{user?.firstName?.slice(0, 1).toUpperCase() ?? 'M'}</Text></View>
          <View style={{ flex: 1 }}><Text style={[styles.profileTitle, { color: colors.foreground }]}>{isSignedIn ? user?.firstName ?? 'Compte connecté' : 'Mode invité'}</Text><Text style={[styles.profileDetail, { color: colors.mutedForeground }]}>{isSignedIn ? 'Compte et synchronisation' : 'Connectez-vous pour synchroniser'}</Text></View><Feather name="chevron-right" size={18} color={colors.mutedForeground} />
        </Pressable>
        <Text style={[styles.section, { color: colors.mutedForeground }]}>LECTURE</Text>
        <View style={[styles.group, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Row icon="play-circle" title="Préférences de lecture" detail="Répétition, file et lecture en arrière-plan" onPress={() => router.push('/settings/playback')} colors={colors} />
          <Row icon="bell" title="Notifications" detail="Contrôler les alertes de l’application" onPress={() => router.push('/settings/notifications')} colors={colors} />
        </View>
        <Text style={[styles.section, { color: colors.mutedForeground }]}>DONNÉES</Text>
        <View style={[styles.group, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Row icon="refresh-cw" title="Synchronisation" detail={syncError ? 'Erreur de synchronisation' : isSyncing ? 'Synchronisation en cours…' : isSignedIn ? 'À jour' : 'Désactivée en mode invité'} onPress={() => router.push('/settings/sync')} colors={colors} />
          <Row icon="hard-drive" title="Stockage local" detail={`${library.length} médias · ${favorites.length} favoris · ${playlists.length} playlists`} onPress={() => router.push('/settings/storage')} colors={colors} />
        </View>
        <Text style={[styles.section, { color: colors.mutedForeground }]}>CONFIDENTIALITÉ</Text>
        <View style={[styles.group, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Row icon="shield" title="Confidentialité et contenus" detail="Fichiers locaux et sources autorisées" onPress={() => router.push('/settings/privacy')} colors={colors} />
        </View>
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
  profile: { marginTop: 22, borderWidth: 1, borderRadius: 19, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  profileTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  profileDetail: { fontSize: 12, marginTop: 3, fontFamily: 'Inter_400Regular' },
  section: { fontSize: 10, letterSpacing: 1.5, marginTop: 26, marginBottom: 9, fontFamily: 'Inter_700Bold' },
  group: { borderWidth: 1, borderRadius: 18, paddingHorizontal: 14 },
  row: { minHeight: 68, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, gap: 12 },
  rowIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  rowCopy: { flex: 1 },
  rowTitle: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  rowDetail: { fontSize: 11, marginTop: 3, fontFamily: 'Inter_400Regular' },
});
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth, useUser } from '@clerk/expo';
import { useColors } from '@/hooks/useColors';

export default function AccountSettingsScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const logout = () => Alert.alert('Se déconnecter ?', 'Vos données locales resteront sur cet appareil.', [{ text: 'Annuler', style: 'cancel' }, { text: 'Se déconnecter', style: 'destructive', onPress: () => signOut().then(() => router.replace('/')).catch(() => undefined) }]);
  return <View style={[styles.container, { backgroundColor: colors.background }]}><ScrollView contentContainerStyle={{ padding: 20, paddingTop: insets.top + 12 }}><Pressable onPress={() => router.back()} style={styles.back}><Feather name="arrow-left" size={20} color={colors.foreground} /><Text style={[styles.backText, { color: colors.foreground }]}>Paramètres</Text></Pressable><Text style={[styles.kicker, { color: colors.primary }]}>COMPTE</Text><Text style={[styles.title, { color: colors.foreground }]}>{isSignedIn ? 'Votre compte' : 'Mode invité'}</Text><View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}><Feather name={isSignedIn ? 'user-check' : 'user'} size={25} color={colors.primary} /><Text style={[styles.email, { color: colors.foreground }]}>{isSignedIn ? user?.primaryEmailAddress?.emailAddress ?? 'Adresse vérifiée' : 'Aucun compte connecté'}</Text><Text style={[styles.body, { color: colors.mutedForeground }]}>{isSignedIn ? 'Les favoris, playlists et l’historique en ligne peuvent être synchronisés entre vos appareils.' : 'La lecture et les importations locales fonctionnent sans compte. Connectez-vous pour activer la synchronisation.'}</Text></View>{isSignedIn ? <Pressable onPress={logout} style={[styles.action, { borderColor: colors.destructive }]}><Feather name="log-out" size={17} color={colors.destructive} /><Text style={[styles.actionText, { color: colors.destructive }]}>Se déconnecter</Text></Pressable> : <Pressable onPress={() => router.push('/(auth)/sign-in')} style={[styles.action, { backgroundColor: colors.primary }]}><Feather name="log-in" size={17} color={colors.primaryForeground} /><Text style={[styles.actionText, { color: colors.primaryForeground }]}>Se connecter</Text></Pressable>}</ScrollView></View>;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 28 },
  backText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  kicker: { fontSize: 11, letterSpacing: 1.8, fontFamily: 'Inter_700Bold' },
  title: { fontSize: 29, marginTop: 7, fontFamily: 'Inter_700Bold' },
  card: { borderWidth: 1, borderRadius: 20, padding: 20, marginTop: 24, alignItems: 'center' },
  email: { fontSize: 15, marginTop: 14, fontFamily: 'Inter_600SemiBold' },
  body: { fontSize: 13, lineHeight: 20, textAlign: 'center', marginTop: 9, fontFamily: 'Inter_400Regular' },
  action: { minHeight: 48, borderWidth: 1, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 18 },
  actionText: { fontSize: 13, fontFamily: 'Inter_700Bold' },
});
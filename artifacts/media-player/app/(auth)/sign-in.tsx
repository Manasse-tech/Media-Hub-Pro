import { useSignIn } from '@clerk/expo';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

export default function SignInScreen() {
  const colors = useColors();
  const router = useRouter();
  const { signIn, errors, fetchStatus } = useSignIn();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const submit = async () => {
    setMessage('');
    const result = await signIn.password({ emailAddress, password });
    if (result.error) {
      setMessage(result.error.message || 'Impossible de se connecter.');
      return;
    }
    if (signIn.status === 'complete') {
      await signIn.finalize({ navigate: () => router.replace('/') });
    } else {
      setMessage('Une vérification supplémentaire est nécessaire.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.brandMark, { backgroundColor: colors.card }]}><Text style={[styles.mark, { color: colors.primary }]}>M</Text></View>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>MEDIA PLAYER</Text>
      <Text style={[styles.title, { color: colors.foreground }]}>Retrouvez votre univers.</Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Connectez-vous pour synchroniser vos playlists et favoris sur tous vos appareils.</Text>
      <TextInput value={emailAddress} onChangeText={setEmailAddress} autoCapitalize="none" keyboardType="email-address" placeholder="Adresse e-mail" placeholderTextColor={colors.mutedForeground} style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} />
      <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Mot de passe" placeholderTextColor={colors.mutedForeground} style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} />
      {message || errors?.fields?.identifier ? <Text style={[styles.error, { color: colors.destructive }]}>{message || errors.fields.identifier?.message}</Text> : null}
      <Pressable testID="sign-in-submit" onPress={submit} disabled={fetchStatus === 'fetching' || !emailAddress || !password} style={({ pressed }) => [styles.primary, { backgroundColor: colors.primary, opacity: pressed || fetchStatus === 'fetching' ? 0.72 : 1 }]}>
        <Text style={[styles.primaryText, { color: colors.primaryForeground }]}>{fetchStatus === 'fetching' ? 'Connexion…' : 'Se connecter'}</Text>
      </Pressable>
      <Text style={[styles.foot, { color: colors.mutedForeground }]}>Pas encore de compte ? <Link href="/sign-up" style={{ color: colors.primary }}>Créer un compte</Link></Text>
      <Pressable onPress={() => router.replace('/')} style={styles.guest}><Text style={[styles.guestText, { color: colors.foreground }]}>Continuer sans compte</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  brandMark: { width: 52, height: 52, borderRadius: 17, backgroundColor: '#14172b', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  mark: { fontSize: 27, fontFamily: 'Inter_700Bold' },
  eyebrow: { fontSize: 11, letterSpacing: 2.2, fontFamily: 'Inter_700Bold' },
  title: { fontSize: 30, lineHeight: 37, fontFamily: 'Inter_700Bold', marginTop: 11 },
  subtitle: { fontSize: 14, lineHeight: 22, fontFamily: 'Inter_400Regular', marginTop: 10, marginBottom: 26 },
  input: { height: 54, borderRadius: 15, borderWidth: 1, paddingHorizontal: 16, fontSize: 15, fontFamily: 'Inter_400Regular', marginBottom: 12 },
  error: { fontSize: 13, marginBottom: 12, fontFamily: 'Inter_500Medium' },
  primary: { height: 54, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginTop: 3 },
  primaryText: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  foot: { textAlign: 'center', fontSize: 13, marginTop: 22, fontFamily: 'Inter_400Regular' },
  guest: { alignSelf: 'center', marginTop: 26, padding: 8 },
  guestText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
});
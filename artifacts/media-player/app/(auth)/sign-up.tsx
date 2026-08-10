import { useSignUp } from '@clerk/expo';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

export default function SignUpScreen() {
  const colors = useColors();
  const router = useRouter();
  const { signUp, errors, fetchStatus } = useSignUp();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const submit = async () => {
    const result = await signUp.password({ emailAddress, password });
    if (result.error) {
      setMessage(result.error.message || 'Impossible de créer le compte.');
      return;
    }
    await signUp.verifications.sendEmailCode();
    setMessage('Un code de vérification a été envoyé à votre adresse.');
  };

  const verify = async () => {
    const result = await signUp.verifications.verifyEmailCode({ code });
    if (result.error) {
      setMessage(result.error.message || 'Code invalide.');
      return;
    }
    if (signUp.status === 'complete') await signUp.finalize({ navigate: () => router.replace('/') });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>NOUVEAU COMPTE</Text>
      <Text style={[styles.title, { color: colors.foreground }]}>{signUp.status === 'missing_requirements' ? 'Vérifiez votre adresse.' : 'Votre bibliothèque, partout.'}</Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Créez un compte pour retrouver vos favoris et playlists sur chaque appareil.</Text>
      {signUp.status === 'missing_requirements' ? (
        <TextInput value={code} onChangeText={setCode} keyboardType="number-pad" placeholder="Code reçu par e-mail" placeholderTextColor={colors.mutedForeground} style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} />
      ) : (
        <>
          <TextInput value={emailAddress} onChangeText={setEmailAddress} autoCapitalize="none" keyboardType="email-address" placeholder="Adresse e-mail" placeholderTextColor={colors.mutedForeground} style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} />
          <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Mot de passe" placeholderTextColor={colors.mutedForeground} style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} />
        </>
      )}
      {message || errors?.fields?.emailAddress ? <Text style={[styles.error, { color: colors.destructive }]}>{message || errors.fields.emailAddress?.message}</Text> : null}
      <Pressable testID="sign-up-submit" onPress={signUp.status === 'missing_requirements' ? verify : submit} disabled={fetchStatus === 'fetching'} style={({ pressed }) => [styles.primary, { backgroundColor: colors.primary, opacity: pressed || fetchStatus === 'fetching' ? 0.72 : 1 }]}>
        <Text style={[styles.primaryText, { color: colors.primaryForeground }]}>{signUp.status === 'missing_requirements' ? 'Vérifier' : 'Créer mon compte'}</Text>
      </Pressable>
      <Text style={[styles.foot, { color: colors.mutedForeground }]}>Déjà inscrit ? <Link href="/sign-in" style={{ color: colors.primary }}>Se connecter</Link></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  eyebrow: { fontSize: 11, letterSpacing: 2.2, fontFamily: 'Inter_700Bold' },
  title: { fontSize: 30, lineHeight: 37, fontFamily: 'Inter_700Bold', marginTop: 11 },
  subtitle: { fontSize: 14, lineHeight: 22, fontFamily: 'Inter_400Regular', marginTop: 10, marginBottom: 26 },
  input: { height: 54, borderRadius: 15, borderWidth: 1, paddingHorizontal: 16, fontSize: 15, fontFamily: 'Inter_400Regular', marginBottom: 12 },
  error: { fontSize: 13, marginBottom: 12, fontFamily: 'Inter_500Medium' },
  primary: { height: 54, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  primaryText: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  foot: { textAlign: 'center', fontSize: 13, marginTop: 22, fontFamily: 'Inter_400Regular' },
});
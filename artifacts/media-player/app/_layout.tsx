import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { ClerkProvider, useAuth } from '@clerk/expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthTokenGetter, setBaseUrl } from '@workspace/api-client-react';
import { MediaProvider } from '@/context/MediaContext';
import { GlobalMediaOverlay } from '@/components/GlobalMediaOverlay';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();
const domain = process.env.EXPO_PUBLIC_DOMAIN;
if (domain) setBaseUrl(`https://${domain}`);

const tokenCache = {
  getToken: (key: string) => AsyncStorage.getItem(key),
  saveToken: (key: string, token: string) => AsyncStorage.setItem(key, token),
  clearToken: (key: string) => AsyncStorage.removeItem(key),
};

function AuthTokenBridge() {
  const { getToken } = useAuth();
  useEffect(() => {
    setAuthTokenGetter(() => getToken());
    return () => setAuthTokenGetter(null);
  }, [getToken]);
  return null;
}

function AppShell({ authenticated }: { authenticated: boolean }) {
  return (
    <MediaProvider isSignedIn={authenticated}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider>
          <View style={{ flex: 1 }}>
            <Stack screenOptions={{ headerBackTitle: 'Back' }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="settings" options={{ headerShown: false }} />
              <Stack.Screen name="settings/account" options={{ headerShown: false }} />
              <Stack.Screen name="settings/sync" options={{ headerShown: false }} />
              <Stack.Screen name="settings/storage" options={{ headerShown: false }} />
              <Stack.Screen name="settings/playback" options={{ headerShown: false }} />
              <Stack.Screen name="settings/notifications" options={{ headerShown: false }} />
              <Stack.Screen name="settings/privacy" options={{ headerShown: false }} />
              <Stack.Screen name="favorites" options={{ headerShown: false }} />
              <Stack.Screen name="history" options={{ headerShown: false }} />
              <Stack.Screen name="queue" options={{ headerShown: false }} />
              <Stack.Screen name="media/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="playlists/[id]" options={{ headerShown: false }} />
            </Stack>
            <GlobalMediaOverlay />
          </View>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </MediaProvider>
  );
}

function AuthenticatedApp() {
  const { isSignedIn } = useAuth();
  return (
    <>
      <AuthTokenBridge />
      <AppShell authenticated={Boolean(isSignedIn)} />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const content = (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          {publishableKey ? <AuthenticatedApp /> : <AppShell authenticated={false} />}
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );

  if (!publishableKey) return content;
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      {content}
    </ClerkProvider>
  );
}

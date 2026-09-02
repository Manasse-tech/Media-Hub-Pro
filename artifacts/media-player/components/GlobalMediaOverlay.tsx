import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FullPlayer } from '@/components/FullPlayer';
import { NowPlayingBar } from '@/components/NowPlayingBar';
import { useMedia } from '@/context/MediaContext';

export function GlobalMediaOverlay() {
  const insets = useSafeAreaInsets();
  const { current, playerVisible, openPlayer, closePlayer } = useMedia();
  if (!current) return null;

  return (
    <>
      <View
        pointerEvents="box-none"
        style={[
          styles.bar,
          { bottom: insets.bottom + (Platform.OS === 'web' ? 84 : 74) },
        ]}
      >
        <NowPlayingBar onOpen={() => openPlayer()} />
      </View>
      <FullPlayer visible={playerVisible} onClose={closePlayer} />
    </>
  );
}

const styles = StyleSheet.create({
  bar: { position: 'absolute', left: 0, right: 0 },
});
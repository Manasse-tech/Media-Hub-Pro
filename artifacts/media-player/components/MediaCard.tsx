import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import type { LocalMedia } from '@/context/MediaContext';

export function MediaCard({
  item,
  onPress,
  onFavorite,
  onRemove,
  onDetails,
  favorite,
  compact = false,
}: {
  item: LocalMedia;
  onPress: () => void;
  onFavorite?: () => void;
  onRemove?: () => void;
  onDetails?: () => void;
  favorite?: boolean;
  compact?: boolean;
}) {
  const colors = useColors();
  return (
    <Pressable
      testID={`media-card-${item.id}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, compact && styles.compact, { backgroundColor: colors.card, opacity: pressed ? 0.82 : 1 }]}
    >
      <View style={[styles.art, compact && styles.compactArt, { backgroundColor: colors.secondary }]}>
        {item.artwork ? <Image source={item.artwork} style={StyleSheet.absoluteFill} contentFit="cover" /> : null}
        <View style={[styles.typeBadge, { backgroundColor: 'rgba(9,11,24,0.76)' }]}>
          <Feather name={item.type === 'video' ? 'film' : 'music'} size={12} color={colors.primary} />
        </View>
      </View>
      <View style={styles.copy}>
        <Text numberOfLines={1} style={[styles.title, { color: colors.foreground }]}>{item.title}</Text>
        <Text numberOfLines={1} style={[styles.artist, { color: colors.mutedForeground }]}>{item.artist}</Text>
      </View>
      {onFavorite ? (
        <Pressable testID={`favorite-${item.id}`} onPress={onFavorite} hitSlop={10} style={styles.favorite}>
          <Feather name={favorite ? 'heart' : 'heart'} size={17} color={favorite ? colors.accent : colors.mutedForeground} />
        </Pressable>
      ) : null}
      {onRemove ? (
        <Pressable onPress={onRemove} hitSlop={10} style={styles.favorite} accessibilityLabel="Retirer de la playlist" accessibilityRole="button">
          <Feather name="x" size={17} color={colors.mutedForeground} />
        </Pressable>
      ) : null}
      {onDetails ? (
        <Pressable onPress={(event) => { event.stopPropagation(); onDetails(); }} hitSlop={10} style={styles.favorite} accessibilityLabel="Voir les détails" accessibilityRole="button">
          <Feather name="info" size={17} color={colors.mutedForeground} />
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: 154, borderRadius: 18, overflow: 'hidden', marginRight: 12 },
  compact: { width: '100%', flexDirection: 'row', alignItems: 'center', padding: 10, marginRight: 0, marginBottom: 10 },
  art: { width: '100%', aspectRatio: 1, position: 'relative' },
  compactArt: { width: 58, height: 58, borderRadius: 12 },
  typeBadge: { position: 'absolute', right: 8, top: 8, width: 25, height: 25, borderRadius: 99, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, padding: 10, paddingBottom: 12 },
  title: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  artist: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 4 },
  favorite: { padding: 12 },
});
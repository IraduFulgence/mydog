import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Breed } from '@/app/types/Breed';
import DogApi from '@/app/api/DogApi';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';
import { typography } from '@/theme/typography';

interface DogCardProps {
  breed: Breed;
  onPress: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - spacing.xl * 2 - spacing.sm) / 2;

export const DogCard: React.FC<DogCardProps> = ({
  breed,
  onPress,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const images = await DogApi.fetchBreedImages(breed.id, 1);
        if (images.length > 0) {
          setImageUrl(images[0].url);
        }
      } catch (error) {
        console.error('Failed to load breed image:', error);
      }
    };

    loadImage();
  }, [breed.id]);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>🐕</Text>
          </View>
        )}
        {onToggleFavorite && (
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={onToggleFavorite}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? colors.accent : colors.surface}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.breedName} numberOfLines={1}>
          {breed.name}
        </Text>
        {breed.temperament && (
          <Text style={styles.temperament} numberOfLines={1}>
            {breed.temperament.split(',')[0].trim()}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginVertical: spacing.sm,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: cardWidth * 0.75,
    backgroundColor: colors.borderLight,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.borderLight,
  },
  placeholderText: {
    fontSize: 40,
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: borderRadius.round,
    padding: spacing.xs,
  },
  cardFooter: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  breedName: {
    fontSize: typography.body.fontSize,
    fontWeight: '600' as const,
    color: colors.text,
  },
  temperament: {
    fontSize: typography.bodySmall.fontSize,
    color: colors.textSecondary,
    textTransform: 'capitalize' as const,
  },
});
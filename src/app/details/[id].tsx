import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Share,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Breed, DogImage } from '@/app/types/Breed';
import { useFavorites } from '@/hooks/useFavorites';
import DogApi from '../api/DogApi';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export default function DetailsScreen(): React.ReactElement {
const { id } = useLocalSearchParams<{ id: string }>();
  const breedId = parseInt(id, 10);
  
  const [breed, setBreed] = useState<Breed | null>(null);
  const [images, setImages] = useState<DogImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const loadBreedData = async (): Promise<void> => {
      try {
        setLoading(true);
        // Fetch breed details
        const breeds = await DogApi.fetchBreedsByIds([breedId]);
        if (breeds.length > 0) {
          setBreed(breeds[0]);
        }
        
        // Fetch breed images
        const breedImages = await DogApi.fetchBreedImages(breedId, 10);
        setImages(breedImages);
        if (breedImages.length > 0) {
          setSelectedImage(breedImages[0].url);
        }
      } catch (error) {
        console.error('Failed to load breed data:', error);
        Alert.alert('Error', 'Failed to load breed details');
      } finally {
        setLoading(false);
      }
    };

    if (breedId) {
      loadBreedData();
    }
  }, [breedId]);

  const handleShare = async (): Promise<void> => {
    if (!breed) return;
    try {
      await Share.share({
        message: `Check out the ${breed.name} dog breed!`,
        title: breed.name,
        url: selectedImage || undefined,
      });
    } catch (error) {
      console.error('Share failed:', error);
      Alert.alert('Error', 'Failed to share breed information');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading breed details..." />;
  }

  if (!breed) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorEmoji}></Text>
        <Text style={styles.errorTitle}>Breed not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const favorite = isFavorite(breed.id);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageCarousel}>
        <Image
          source={{ uri: selectedImage || images[0]?.url }}
          style={styles.mainImage}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(breed)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={favorite ? 'heart' : 'heart-outline'}
            size={28}
            color={favorite ? colors.accent : colors.surface}
          />
        </TouchableOpacity>
        {images.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbnailContainer}
            contentContainerStyle={styles.thumbnailContent}
          >
            {images.map((img: DogImage) => (
              <TouchableOpacity
                key={img.id}
                onPress={() => setSelectedImage(img.url)}
                style={[
                  styles.thumbnail,
                  selectedImage === img.url && styles.thumbnailActive,
                ]}
                activeOpacity={0.7}
              >
                <Image source={{ uri: img.url }} style={styles.thumbnailImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.header}>
          <Text style={styles.breedName}>{breed.name}</Text>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Ionicons name="share-social" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          {breed.life_span && (
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <Text style={styles.statLabel}>Lifespan</Text>
              <Text style={styles.statValue}>{breed.life_span}</Text>
            </View>
          )}
          {breed.weight?.metric && (
            <View style={styles.statItem}>
              <Ionicons name="barbell-outline" size={20} color={colors.primary} />
              <Text style={styles.statLabel}>Weight</Text>
              <Text style={styles.statValue}>{breed.weight.metric} kg</Text>
            </View>
          )}
          {breed.height?.metric && (
            <View style={styles.statItem}>
              <Ionicons name="resize-outline" size={20} color={colors.primary} />
              <Text style={styles.statLabel}>Height</Text>
              <Text style={styles.statValue}>{breed.height.metric} cm</Text>
            </View>
          )}
        </View>

        {breed.origin && (
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Origin: </Text>
              {breed.origin}
            </Text>
          </View>
        )}

        {breed.breed_group && (
          <View style={styles.infoRow}>
            <Ionicons name="paw-outline" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Group: </Text>
              {breed.breed_group}
            </Text>
          </View>
        )}

        {breed.temperament && (
          <View style={styles.temperamentContainer}>
            <Text style={styles.sectionTitle}>Temperament</Text>
            <View style={styles.temperamentChips}>
              {breed.temperament.split(',').map((trait: string) => (
                <View key={trait.trim()} style={styles.chip}>
                  <Text style={styles.chipText}>{trait.trim()}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {breed.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>About {breed.name}</Text>
            <Text style={styles.descriptionText}>{breed.description}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  errorTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: spacing.xl,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.round,
  },
  backButtonText: {
    color: colors.surface,
    fontSize: typography.button.fontSize,
    fontWeight: '600' as const,
  },
  imageCarousel: {
    backgroundColor: colors.surface,
    position: 'relative',
  },
  mainImage: {
    width: width,
    height: width * 0.8,
    backgroundColor: colors.borderLight,
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: borderRadius.round,
    padding: spacing.sm,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  thumbnailContainer: {
    position: 'absolute',
    bottom: spacing.md,
    left: 0,
    right: 0,
  },
  thumbnailContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.surface,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnailActive: {
    borderColor: colors.primary,
    borderWidth: 3,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: spacing.xl,
    backgroundColor: colors.surface,
    marginTop: -spacing.lg,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    minHeight: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  breedName: {
    fontSize: typography.h2.fontSize,
    fontWeight: 'bold' as const,
    color: colors.text,
    flex: 1,
  },
  shareButton: {
    padding: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  statItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  statLabel: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statValue: {
    fontSize: typography.body.fontSize,
    fontWeight: '600' as const,
    color: colors.text,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: typography.body.fontSize,
    color: colors.text,
    flex: 1,
  },
  infoLabel: {
    fontWeight: '600' as const,
    color: colors.text,
  },
  temperamentContainer: {
    marginVertical: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: spacing.md,
  },
  temperamentChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.background,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.round,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    fontSize: typography.bodySmall.fontSize,
    color: colors.textSecondary,
    textTransform: 'capitalize' as const,
  },
  descriptionContainer: {
    marginTop: spacing.md,
  },
  descriptionText: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
    lineHeight: 24,
  },
});
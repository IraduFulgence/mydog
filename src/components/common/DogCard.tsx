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
import DogApi from '@/app/api/DogApi';
import { Breed } from '@/app/types/Breed';
// This is where we will load all breeds to display each on card 
interface DogCardProps {
  breed: Breed;
  onPress: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 40 - 12) / 2;

export const DogCard: React.FC<DogCardProps> = ({
  breed,
  onPress,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Load the breed image - I should add a placeholder
  useEffect(() => {
    const loadImage = async (): Promise<void> => {
      try {
        const images = await DogApi.fetchBreedImages(breed.id, 1);
        if (images.length > 0) {
          setImageUrl(images[0].url);
        }
      } catch (error) {
        // Just use the placeholder if image fails
        console.debug('Image load failed for breed:', breed.id);
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
              color={isFavorite ? '#ff6b6b' : '#fff'}
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

// style for my main card

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: cardWidth * 0.75,
    backgroundColor: '#f0ede8',
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
    backgroundColor: '#f0ede8',
  },
  placeholderText: {
    fontSize: 40,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 999,
    padding: 6,
  },
  cardFooter: {
    padding: 12,
    gap: 4,
  },
  breedName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c2c2c',
  },
  temperament: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
});
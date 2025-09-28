import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Image as ImageIcon } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useImagePicker } from '@/hooks/useImagePicker';
import { galleryService } from '@/services/galleryService';
import { GalleryItem } from '@/types';
import { router } from 'expo-router';

export default function CameraScreen() {
  const { user } = useAuth();
  const { colors, theme } = useTheme();
  const { takePhoto, pickImageFromGallery, loading } = useImagePicker();
  
  const [adding, setAdding] = useState(false);

  const addImageToGallery = async (imageUri: string) => {
    if (!user) return;
    
    setAdding(true);
    try {
      const newItem: GalleryItem = {
        id: Date.now().toString(),
        userId: user.id,
        imageUri,
        caption: '',
        hashtags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await galleryService.addItem(newItem);
      
      Alert.alert(
        'Photo Added',
        'Your photo has been added to the gallery!',
        [
          { text: 'View Gallery', onPress: () => router.push('/(tabs)') },
          { text: 'Add Another', style: 'cancel' },
        ]
      );
    } catch (error) {
      console.error('Error adding photo:', error);
      Alert.alert('Error', 'Failed to add photo to gallery');
    } finally {
      setAdding(false);
    }
  };

  const handleTakePhoto = useCallback(async () => {
    try {
      const imageUri = await takePhoto();
      if (imageUri) {
        await addImageToGallery(imageUri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  }, [takePhoto, addImageToGallery]);

  const handleSelectFromGallery = useCallback(async () => {
    try {
      const imageUri = await pickImageFromGallery();
      if (imageUri) {
        await addImageToGallery(imageUri);
      }
    } catch (error) {
      console.error('Error selecting photo:', error);
      Alert.alert('Error', 'Failed to select photo');
    }
  }, [pickImageFromGallery, addImageToGallery]);

  const isLoading = loading || adding;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Add Photo</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Choose how you'd like to add a photo to your gallery
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { 
                backgroundColor: colors.surface,
                borderColor: colors.border,
                opacity: isLoading ? 0.7 : 1,
              }
            ]}
            onPress={handleTakePhoto}
            disabled={isLoading}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
              {isLoading ? (
                <ActivityIndicator color={colors.primary} size="large" />
              ) : (
                <Camera color={colors.primary} size={32} />
              )}
            </View>
            <Text style={[styles.buttonTitle, { color: colors.text }]}>Take Photo</Text>
            <Text style={[styles.buttonSubtitle, { color: colors.textSecondary }]}>
              Use your device's camera
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { 
                backgroundColor: colors.surface,
                borderColor: colors.border,
                opacity: isLoading ? 0.7 : 1,
              }
            ]}
            onPress={handleSelectFromGallery}
            disabled={isLoading}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.secondary + '20' }]}>
              {isLoading ? (
                <ActivityIndicator color={colors.secondary} size="large" />
              ) : (
                <ImageIcon color={colors.secondary} size={32} />
              )}
            </View>
            <Text style={[styles.buttonTitle, { color: colors.text }]}>Choose from Gallery</Text>
            <Text style={[styles.buttonSubtitle, { color: colors.textSecondary }]}>
              Select from your photo library
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tips}>
          <Text style={[styles.tipsTitle, { color: colors.text }]}>💡 Tips</Text>
          <Text style={[styles.tipText, { color: colors.textSecondary }]}>
            • After adding a photo, you can use voice recognition to add captions
          </Text>
          <Text style={[styles.tipText, { color: colors.textSecondary }]}>
            • Photos are automatically saved to your gallery
          </Text>
          <Text style={[styles.tipText, { color: colors.textSecondary }]}>
            • You can edit captions and share photos anytime
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 48,
  },
  actionButton: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  tips: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
});
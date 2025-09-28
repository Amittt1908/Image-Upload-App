import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

export const useImagePicker = () => {
  const [loading, setLoading] = useState(false);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraPermission.status !== 'granted' || mediaPermission.status !== 'granted') {
        Alert.alert(
          'Permissions Required',
          'Please grant camera and photo library permissions to add images.'
        );
        return false;
      }
    }
    return true;
  };

  const pickImageFromGallery = async (): Promise<string | null> => {
    try {
      setLoading(true);
      const hasPermission = await requestPermissions();
      if (!hasPermission) return null;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
      return null;
    } catch (error) {
      console.error('Error picking image from gallery:', error);
      Alert.alert('Error', 'Failed to pick image from gallery');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async (): Promise<string | null> => {
    try {
      setLoading(true);
      const hasPermission = await requestPermissions();
      if (!hasPermission) return null;

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
      return null;
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const showImagePickerOptions = (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (Platform.OS === 'web') {
        // On web, directly open gallery
        pickImageFromGallery().then(resolve);
      } else {
        Alert.alert(
          'Select Image',
          'Choose how you want to add an image',
          [
            { text: 'Camera', onPress: () => takePhoto().then(resolve) },
            { text: 'Gallery', onPress: () => pickImageFromGallery().then(resolve) },
            { text: 'Cancel', onPress: () => resolve(null), style: 'cancel' },
          ]
        );
      }
    });
  };

  return {
    pickImageFromGallery,
    takePhoto,
    showImagePickerOptions,
    loading,
  };
};
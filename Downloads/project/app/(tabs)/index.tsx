import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Plus } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useImagePicker } from '@/hooks/useImagePicker';
import { galleryService } from '@/services/galleryService';
import { GalleryItem } from '@/types';
import GalleryGrid from '@/components/GalleryGrid';
import SearchBar from '@/components/SearchBar';

export default function GalleryScreen() {
  const { user } = useAuth();
  const { colors, theme } = useTheme();
  const { showImagePickerOptions, loading: imagePickerLoading } = useImagePicker();
  
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    return galleryService.searchItems(items, searchQuery);
  }, [items, searchQuery]);

  const loadItems = useCallback(async () => {
    try {
      const storedItems = await galleryService.getItems();
      const userItems = storedItems.filter(item => item.userId === user?.id);
      setItems(userItems);
    } catch (error) {
      console.error('Error loading gallery items:', error);
      Alert.alert('Error', 'Failed to load gallery items');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  }, [loadItems]);

  const handleAddImage = useCallback(async () => {
    try {
      const imageUri = await showImagePickerOptions();
      if (imageUri && user) {
        const newItem: GalleryItem = {
          id: Date.now().toString(),
          userId: user.id,
          imageUri,
          caption: '',
          hashtags: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        const updatedItems = await galleryService.addItem(newItem);
        const userItems = updatedItems.filter(item => item.userId === user.id);
        setItems(userItems);
      }
    } catch (error) {
      console.error('Error adding image:', error);
      Alert.alert('Error', 'Failed to add image');
    }
  }, [showImagePickerOptions, user]);

  const handleDeleteItem = useCallback(async (id: string) => {
    try {
      const updatedItems = await galleryService.deleteItem(id);
      const userItems = updatedItems.filter(item => item.userId === user?.id);
      setItems(userItems);
    } catch (error) {
      console.error('Error deleting item:', error);
      Alert.alert('Error', 'Failed to delete item');
    }
  }, [user?.id]);

  const handleUpdateItem = useCallback(async (updatedItem: GalleryItem) => {
    try {
      // Extract hashtags from caption
      const hashtags = galleryService.extractHashtags(updatedItem.caption);
      const itemWithHashtags = { ...updatedItem, hashtags };
      
      const updatedItems = await galleryService.updateItem(itemWithHashtags);
      const userItems = updatedItems.filter(item => item.userId === user?.id);
      setItems(userItems);
    } catch (error) {
      console.error('Error updating item:', error);
      Alert.alert('Error', 'Failed to update item');
    }
  }, [user?.id]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      
      <SearchBar onSearch={setSearchQuery} />
      
      <GalleryGrid
        items={filteredItems}
        onDeleteItem={handleDeleteItem}
        onUpdateItem={handleUpdateItem}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      <TouchableOpacity
        style={[
          styles.addButton,
          { 
            backgroundColor: colors.primary,
            opacity: imagePickerLoading ? 0.7 : 1,
          }
        ]}
        onPress={handleAddImage}
        disabled={imagePickerLoading}
      >
        {imagePickerLoading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Plus color="white" size={24} />
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
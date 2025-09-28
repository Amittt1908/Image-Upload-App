import AsyncStorage from '@react-native-async-storage/async-storage';
import { GalleryItem } from '@/types';

const STORAGE_KEY = 'galleryItems';

export const galleryService = {
  async getItems(): Promise<GalleryItem[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting gallery items:', error);
      return [];
    }
  },

  async saveItems(items: GalleryItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving gallery items:', error);
      throw error;
    }
  },

  async addItem(item: GalleryItem): Promise<GalleryItem[]> {
    try {
      const items = await this.getItems();
      const newItems = [item, ...items];
      await this.saveItems(newItems);
      return newItems;
    } catch (error) {
      console.error('Error adding gallery item:', error);
      throw error;
    }
  },

  async deleteItem(id: string): Promise<GalleryItem[]> {
    try {
      const items = await this.getItems();
      const filteredItems = items.filter(item => item.id !== id);
      await this.saveItems(filteredItems);
      return filteredItems;
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      throw error;
    }
  },

  async updateItem(updatedItem: GalleryItem): Promise<GalleryItem[]> {
    try {
      const items = await this.getItems();
      const updatedItems = items.map(item => 
        item.id === updatedItem.id ? { ...updatedItem, updatedAt: new Date().toISOString() } : item
      );
      await this.saveItems(updatedItems);
      return updatedItems;
    } catch (error) {
      console.error('Error updating gallery item:', error);
      throw error;
    }
  },

  searchItems(items: GalleryItem[], query: string): GalleryItem[] {
    if (!query.trim()) return items;
    
    const lowercaseQuery = query.toLowerCase();
    return items.filter(item => {
      const captionMatch = item.caption.toLowerCase().includes(lowercaseQuery);
      const hashtagMatch = item.hashtags.some(tag => 
        tag.toLowerCase().includes(lowercaseQuery)
      );
      return captionMatch || hashtagMatch;
    });
  },

  extractHashtags(caption: string): string[] {
    const hashtagRegex = /#[\w\u0590-\u05ff]+/g;
    const matches = caption.match(hashtagRegex);
    return matches ? matches.map(tag => tag.toLowerCase()) : [];
  },

  filterByHashtag(items: GalleryItem[], hashtag: string): GalleryItem[] {
    return items.filter(item => 
      item.hashtags.includes(hashtag.toLowerCase())
    );
  },

  getPopularHashtags(items: GalleryItem[], limit: number = 10): string[] {
    const hashtagCount: { [key: string]: number } = {};
    
    items.forEach(item => {
      item.hashtags.forEach(tag => {
        hashtagCount[tag] = (hashtagCount[tag] || 0) + 1;
      });
    });

    return Object.entries(hashtagCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([tag]) => tag);
  },
};
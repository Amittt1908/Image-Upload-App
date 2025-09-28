import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import * as Sharing from 'expo-sharing';
import { Share, Trash2, Edit3, X, Save } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { GalleryItem } from '@/types';
import SmartCaptionInput from '@/components/SmartCaptionInput';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 48) / 2; // 2 columns with padding

interface GalleryGridProps {
  items: GalleryItem[];
  onDeleteItem: (id: string) => void;
  onUpdateItem: (item: GalleryItem) => void;
  refreshing: boolean;
  onRefresh: () => void;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({
  items,
  onDeleteItem,
  onUpdateItem,
  refreshing,
  onRefresh,
}) => {
  const { colors, theme } = useTheme();
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [editingCaption, setEditingCaption] = useState(false);
  const [captionText, setCaptionText] = useState('');

  const handleItemPress = useCallback((item: GalleryItem) => {
    setSelectedItem(item);
    setCaptionText(item.caption);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedItem(null);
    setEditingCaption(false);
    setCaptionText('');
  }, []);

  const handleStartEdit = useCallback(() => {
    setEditingCaption(true);
  }, []);

  const handleSaveCaption = useCallback(async () => {
    if (selectedItem) {
      const updatedItem = { ...selectedItem, caption: captionText };
      await onUpdateItem(updatedItem);
      setSelectedItem(updatedItem);
      setEditingCaption(false);
    }
  }, [selectedItem, captionText, onUpdateItem]);

  const handleShare = useCallback(async (item: GalleryItem) => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(item.imageUri, {
          dialogTitle: 'Share Photo',
        });
      } else {
        Alert.alert('Sharing not available', 'Sharing is not supported on this platform.');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share image');
    }
  }, []);

  const handleDelete = useCallback((item: GalleryItem) => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDeleteItem(item.id);
            handleCloseModal();
          },
        },
      ]
    );
  }, [onDeleteItem, handleCloseModal]);

  const renderItem = useCallback(({ item }: { item: GalleryItem }) => (
    <TouchableOpacity
      style={[styles.itemContainer, { backgroundColor: colors.surface }]}
      onPress={() => handleItemPress(item)}
    >
      <Image source={{ uri: item.imageUri }} style={styles.image} />
      {item.caption ? (
        <View style={[styles.captionOverlay, { backgroundColor: colors.background + 'E6' }]}>
          <Text style={[styles.captionText, { color: colors.text }]} numberOfLines={2}>
            {item.caption}
          </Text>
        </View>
      ) : null}
      {item.hashtags && item.hashtags.length > 0 && (
        <View style={[styles.hashtagOverlay, { backgroundColor: colors.primary + 'E6' }]}>
          <Text style={styles.hashtagCount} numberOfLines={1}>
            {item.hashtags.slice(0, 2).join(' ')}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  ), [colors, handleItemPress]);

  if (items.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Your gallery is empty
        </Text>
        <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
          Tap the + button to add your first photo
        </Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.container}
        columnWrapperStyle={styles.row}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={!!selectedItem}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <BlurView intensity={80} tint={theme} style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handleCloseModal}>
                <X color={colors.text} size={24} />
              </TouchableOpacity>
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => selectedItem && handleShare(selectedItem)}
                >
                  <Share color={colors.primary} size={20} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => selectedItem && handleDelete(selectedItem)}
                >
                  <Trash2 color={colors.error} size={20} />
                </TouchableOpacity>
              </View>
            </View>

            {selectedItem && (
              <>
                <Image source={{ uri: selectedItem.imageUri }} style={styles.modalImage} />
                
                <View style={styles.captionContainer}>
                  {editingCaption ? (
                    <>
                      <SmartCaptionInput
                        value={captionText}
                        onChangeText={setCaptionText}
                        placeholder="Add a caption with hashtags..."
                        autoFocus
                      />
                      <TouchableOpacity
                        style={[styles.saveButton, { backgroundColor: colors.primary }]}
                        onPress={handleSaveCaption}
                      >
                        <Save color="white" size={16} />
                        <Text style={styles.saveButtonText}>Save Caption</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <View style={styles.captionDisplay}>
                      <TouchableOpacity
                        style={styles.editCaptionButton}
                        onPress={handleStartEdit}
                      >
                        <Edit3 color={colors.primary} size={16} />
                      </TouchableOpacity>
                      <Text style={[styles.modalCaption, { color: colors.text }]}>
                        {selectedItem.caption || 'No caption'}
                      </Text>
                    </View>
                  )}
                </View>
              </>
            )}
          </View>
        </BlurView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  itemContainer: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  captionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
  },
  captionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  hashtagOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  hashtagCount: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  modalImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
  },
  captionContainer: {
    marginTop: 8,
    gap: 12,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  captionDisplay: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  editCaptionButton: {
    padding: 4,
  },
  modalCaption: {
    fontSize: 16,
    flex: 1,
    lineHeight: 24,
  },
});

export default GalleryGrid;
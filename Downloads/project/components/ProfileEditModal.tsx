import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { X, Save, Camera, User, MapPin, Globe, FileText } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useImagePicker } from '@/hooks/useImagePicker';

interface ProfileEditModalProps {
  visible: boolean;
  onClose: () => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ visible, onClose }) => {
  const { user, updateProfile } = useAuth();
  const { colors, theme } = useTheme();
  const { showImagePickerOptions, loading: imageLoading } = useImagePicker();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    website: '',
    picture: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        picture: user.picture || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    setLoading(true);
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        Alert.alert('Success', 'Profile updated successfully!');
        onClose();
      } else {
        Alert.alert('Error', result.error || 'Failed to update profile');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = async () => {
    try {
      const imageUri = await showImagePickerOptions();
      if (imageUri) {
        setFormData(prev => ({ ...prev, picture: imageUri }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile picture');
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <BlurView intensity={80} tint={theme} style={styles.container}>
        <View style={[styles.modal, { backgroundColor: colors.surface }]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <X color={colors.text} size={24} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text }]}>Edit Profile</Text>
            <TouchableOpacity
              onPress={handleSave}
              disabled={loading}
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Save color="white" size={20} />
              )}
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.avatarSection}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: formData.picture }}
                  style={[styles.avatar, { borderColor: colors.border }]}
                />
                <TouchableOpacity
                  style={[styles.avatarButton, { backgroundColor: colors.primary }]}
                  onPress={handleImagePick}
                  disabled={imageLoading}
                >
                  {imageLoading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Camera color="white" size={16} />
                  )}
                </TouchableOpacity>
              </View>
              <Text style={[styles.avatarText, { color: colors.textSecondary }]}>
                Tap to change profile picture
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <View style={styles.inputHeader}>
                  <User color={colors.primary} size={20} />
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Name</Text>
                </View>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text,
                    }
                  ]}
                  value={formData.name}
                  onChangeText={(text) => updateField('name', text)}
                  placeholder="Your full name"
                  placeholderTextColor={colors.textSecondary}
                  maxLength={50}
                />
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputHeader}>
                  <FileText color={colors.primary} size={20} />
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Bio</Text>
                </View>
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text,
                    }
                  ]}
                  value={formData.bio}
                  onChangeText={(text) => updateField('bio', text)}
                  placeholder="Tell us about yourself..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={3}
                  maxLength={150}
                />
                <Text style={[styles.charCount, { color: colors.textSecondary }]}>
                  {formData.bio.length}/150
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputHeader}>
                  <MapPin color={colors.primary} size={20} />
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Location</Text>
                </View>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text,
                    }
                  ]}
                  value={formData.location}
                  onChangeText={(text) => updateField('location', text)}
                  placeholder="City, Country"
                  placeholderTextColor={colors.textSecondary}
                  maxLength={50}
                />
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputHeader}>
                  <Globe color={colors.primary} size={20} />
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Website</Text>
                </View>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text,
                    }
                  ]}
                  value={formData.website}
                  onChangeText={(text) => updateField('website', text)}
                  placeholder="https://yourwebsite.com"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="url"
                  autoCapitalize="none"
                  maxLength={100}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modal: {
    height: '90%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  saveButton: {
    padding: 8,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
  },
  avatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    textAlign: 'center',
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
});

export default ProfileEditModal;
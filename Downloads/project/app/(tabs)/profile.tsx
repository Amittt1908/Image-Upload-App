import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  LogOut, 
  Edit3, 
  Settings, 
  Calendar, 
  MapPin, 
  Globe, 
  Trash2,
  Moon,
  Sun,
  Palette,
  Camera,
  Heart,
  Share2
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import ProfileEditModal from '@/components/ProfileEditModal';

export default function ProfileScreen() {
  const { user, logout, deleteAccount } = useAuth();
  const { colors, theme, themeMode, setThemeMode } = useTheme();
  const [showEditModal, setShowEditModal] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive', 
          onPress: () => {
            logout();
          }
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your photos and data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            deleteAccount();
          },
        },
      ]
    );
  };

  const handleThemeModeChange = () => {
    const modes: Array<'light' | 'dark' | 'system'> = ['system', 'light', 'dark'];
    const currentIndex = modes.indexOf(themeMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setThemeMode(modes[nextIndex]);
  };

  const getThemeModeLabel = () => {
    switch (themeMode) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      case 'system': return 'System';
      default: return 'System';
    }
  };

  const getThemeModeIcon = () => {
    switch (themeMode) {
      case 'light': return <Sun color={colors.primary} size={20} />;
      case 'dark': return <Moon color={colors.primary} size={20} />;
      case 'system': return <Palette color={colors.primary} size={20} />;
      default: return <Palette color={colors.primary} size={20} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  if (!user) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: user.picture }} 
              style={[styles.avatar, { borderColor: colors.border }]} 
            />
            <TouchableOpacity
              style={[styles.editAvatarButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowEditModal(true)}
            >
              <Camera color="white" size={16} />
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>{user.email}</Text>
          
          {user.bio && (
            <Text style={[styles.bio, { color: colors.text }]}>{user.bio}</Text>
          )}

          <View style={styles.userInfo}>
            {user.location && (
              <View style={styles.infoItem}>
                <MapPin color={colors.textSecondary} size={16} />
                <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                  {user.location}
                </Text>
              </View>
            )}
            
            {user.website && (
              <View style={styles.infoItem}>
                <Globe color={colors.textSecondary} size={16} />
                <Text style={[styles.infoText, { color: colors.primary }]}>
                  {user.website}
                </Text>
              </View>
            )}
            
            <View style={styles.infoItem}>
              <Calendar color={colors.textSecondary} size={16} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                Joined {formatDate(user.joinedAt)}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.editProfileButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => setShowEditModal(true)}
          >
            <Edit3 color={colors.primary} size={18} />
            <Text style={[styles.editProfileText, { color: colors.primary }]}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <View style={[styles.statsSection, { backgroundColor: colors.surface }]}>
          <View style={styles.statItem}>
            <Camera color={colors.primary} size={24} />
            <Text style={[styles.statNumber, { color: colors.text }]}>0</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Photos</Text>
          </View>
          <View style={styles.statItem}>
            <Heart color={colors.error} size={24} />
            <Text style={[styles.statNumber, { color: colors.text }]}>0</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Likes</Text>
          </View>
          <View style={styles.statItem}>
            <Share2 color={colors.success} size={24} />
            <Text style={[styles.statNumber, { color: colors.text }]}>0</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Shared</Text>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
          
          <View style={[styles.settingItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.settingLeft}>
              {getThemeModeIcon()}
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Appearance</Text>
                <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                  {getThemeModeLabel()} theme
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.themeButton, { backgroundColor: colors.primary + '20' }]}
              onPress={handleThemeModeChange}
            >
              <Text style={[styles.themeButtonText, { color: colors.primary }]}>
                {getThemeModeLabel()}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.settingItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.settingLeft}>
              <Settings color={colors.textSecondary} size={20} />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>App Settings</Text>
                <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                  Notifications, privacy & more
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Text style={[styles.sectionTitle, { color: colors.error }]}>Danger Zone</Text>
          
          <TouchableOpacity
            style={[styles.dangerButton, { backgroundColor: colors.error + '10', borderColor: colors.error }]}
            onPress={handleDeleteAccount}
          >
            <Trash2 color={colors.error} size={20} />
            <Text style={[styles.dangerText, { color: colors.error }]}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={handleLogout}
          >
            <LogOut color={colors.textSecondary} size={20} />
            <Text style={[styles.logoutText, { color: colors.textSecondary }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Photo Gallery v1.0.0
          </Text>
        </View>
      </ScrollView>

      <ProfileEditModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    paddingBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    marginBottom: 12,
  },
  bio: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  userInfo: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 1,
    gap: 8,
  },
  editProfileText: {
    fontSize: 16,
    fontWeight: '600',
  },
  statsSection: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 16,
    padding: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
  },
  settingsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  themeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  themeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dangerSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  dangerText: {
    fontSize: 16,
    fontWeight: '500',
  },
  actionsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  footerText: {
    fontSize: 12,
  },
});
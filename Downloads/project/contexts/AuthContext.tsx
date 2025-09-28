import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, User } from '@/types';
import { signInWithGoogle, signOutGoogle, getStoredGoogleUser } from '@/services/googleAuthService';
import { router } from 'expo-router';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  forceLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock user database - In production, this would be a real backend
const MOCK_USERS_KEY = 'mock_users_db';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      // First check for Google user
      const googleUser = await getStoredGoogleUser();
      if (googleUser) {
        // Update last active
        googleUser.lastActive = new Date().toISOString();
        await AsyncStorage.setItem('current_user', JSON.stringify(googleUser));
        
        setAuthState({
          isAuthenticated: true,
          user: googleUser,
          loading: false,
        });
        return;
      }

      // Fallback to regular stored user
      const storedUser = await AsyncStorage.getItem('current_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        // Update last active
        user.lastActive = new Date().toISOString();
        await AsyncStorage.setItem('current_user', JSON.stringify(user));
        
        setAuthState({
          isAuthenticated: true,
          user,
          loading: false,
        });
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const getMockUsers = async (): Promise<User[]> => {
    try {
      const stored = await AsyncStorage.getItem(MOCK_USERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  };

  const saveMockUsers = async (users: User[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  };

  const generateUserId = (): string => {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
  };

  const generateAvatarUrl = (name: string): string => {
    const colors = ['FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7', 'DDA0DD', 'FFB347'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${color}&color=fff&size=200&bold=true`;
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const users = await getMockUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        return { success: false, error: 'User not found. Please check your email or sign up.' };
      }

      // In a real app, you'd verify the password hash
      // For demo purposes, we'll accept any password for existing users
      
      const updatedUser = {
        ...user,
        lastActive: new Date().toISOString(),
      };

      await AsyncStorage.setItem('current_user', JSON.stringify(updatedUser));
      
      setAuthState({
        isAuthenticated: true,
        user: updatedUser,
        loading: false,
      });

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1200));

      const users = await getMockUsers();
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (existingUser) {
        return { success: false, error: 'An account with this email already exists.' };
      }

      const newUser: User = {
        id: generateUserId(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        picture: generateAvatarUrl(name),
        bio: '',
        location: '',
        website: '',
        joinedAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      };

      const updatedUsers = [...users, newUser];
      await saveMockUsers(updatedUsers);
      await AsyncStorage.setItem('current_user', JSON.stringify(newUser));

      setAuthState({
        isAuthenticated: true,
        user: newUser,
        loading: false,
      });

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await signInWithGoogle();
      
      if (result.success && result.user) {
        // Store user in AsyncStorage for consistency
        await AsyncStorage.setItem('current_user', JSON.stringify(result.user));
        
        setAuthState({
          isAuthenticated: true,
          user: result.user,
          loading: false,
        });

        return { success: true };
      } else {
        return { success: false, error: result.error || 'Google login failed' };
      }
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, error: 'Google login failed. Please try again.' };
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!authState.user) {
        return { success: false, error: 'No user logged in' };
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const users = await getMockUsers();
      const userIndex = users.findIndex(u => u.id === authState.user!.id);

      if (userIndex === -1) {
        return { success: false, error: 'User not found' };
      }

      const updatedUser = {
        ...authState.user,
        ...updates,
        lastActive: new Date().toISOString(),
      };

      users[userIndex] = updatedUser;
      await saveMockUsers(users);
      await AsyncStorage.setItem('current_user', JSON.stringify(updatedUser));

      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));

      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Failed to update profile. Please try again.' };
    }
  };

  const deleteAccount = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!authState.user) {
        return { success: false, error: 'No user logged in' };
      }

      // Remove user from mock data
      const users = await getMockUsers();
      const filteredUsers = users.filter(u => u.id !== authState.user!.id);
      await saveMockUsers(filteredUsers);

      // Clear ALL storage data immediately
      await AsyncStorage.multiRemove([
        'current_user', 
        'galleryItems', 
        'app_settings',
        'google_user',
        'google_access_token'
      ]);

      // Sign out from Google
      try {
        await signOutGoogle();
      } catch (googleError) {
        // Continue even if Google sign out fails
      }

      // Force immediate state update
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
      
      // Force navigation to login screen
      setTimeout(() => {
        router.replace('/');
      }, 50);

      return { success: true };
    } catch (error) {
      console.error('Account deletion error:', error);
      // Force logout even if there's an error
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
      router.replace('/');
      return { success: false, error: 'Account deleted with errors' };
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const users = await getMockUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        return { success: false, error: 'No account found with this email address.' };
      }

      // In a real app, you'd send a password reset email
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: 'Failed to send reset email. Please try again.' };
    }
  };

  const forceLogout = useCallback(() => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
    });
  }, []);

  const logout = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      // Clear ALL storage data immediately
      await AsyncStorage.multiRemove([
        'current_user', 
        'galleryItems', 
        'app_settings',
        'google_user',
        'google_access_token'
      ]);
      
      // Sign out from Google
      try {
        await signOutGoogle();
      } catch (googleError) {
        // Continue even if Google sign out fails
      }
      
      // Force immediate state update
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
      
      // Force navigation to login screen
      setTimeout(() => {
        router.replace('/');
      }, 50);

      return { success: true };
    } catch (error) {
      console.error('Error during logout:', error);
      // Force logout even if there's an error
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
      router.replace('/');
      return { success: false, error: 'Logged out with errors' };
    }
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      register,
      loginWithGoogle,
      logout,
      updateProfile,
      deleteAccount,
      resetPassword,
      forceLogout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
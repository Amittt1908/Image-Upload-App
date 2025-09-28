import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

interface LogoutButtonProps {
  style?: any;
  textStyle?: any;
  children?: React.ReactNode;
  onPress?: () => void;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  style, 
  textStyle, 
  children = 'Logout',
  onPress
}) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    if (onPress) {
      onPress();
      return;
    }
    
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

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={handleLogout}>
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

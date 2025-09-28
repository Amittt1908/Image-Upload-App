import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import AuthScreen from '@/components/AuthScreen';

export default function IndexScreen() {
  const { isAuthenticated, loading, user } = useAuth();
  const { colors } = useTheme();
  const [refreshKey, setRefreshKey] = useState(0);

  // Force refresh when authentication state changes
  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [isAuthenticated, user?.id]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isAuthenticated && user) {
    return <Redirect href="/(tabs)" key={`authenticated-${user.id}-${refreshKey}`} />;
  }

  return <AuthScreen key={`not-authenticated-${refreshKey}`} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
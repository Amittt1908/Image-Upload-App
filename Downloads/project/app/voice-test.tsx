import React from 'react';
import { View, StyleSheet } from 'react-native';
import { VoiceDebug } from '@/components/VoiceDebug';

export default function VoiceTestPage() {
  return (
    <View style={styles.container}>
      <VoiceDebug />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

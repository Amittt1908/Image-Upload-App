import React from 'react';
import { View, StyleSheet } from 'react-native';
import { VoiceDebug } from '@/components/VoiceDebug';
import { useVoiceToText } from '@/hooks/useVoiceToTextMock';

// Override the hook import for testing
const MockVoiceDebug = () => {
  const voiceProps = useVoiceToText();
  return <VoiceDebug {...voiceProps} />;
};

export default function VoiceTestMockPage() {
  return (
    <View style={styles.container}>
      <MockVoiceDebug />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

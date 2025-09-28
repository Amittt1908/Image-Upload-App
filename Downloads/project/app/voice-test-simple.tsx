import React from 'react';
import { View, StyleSheet } from 'react-native';
import { VoiceDebug } from '@/components/VoiceDebug';
import { useVoiceToText } from '@/hooks/useVoiceToTextSimple';

// Override the hook import for testing
const SimpleVoiceDebug = () => {
  const voiceProps = useVoiceToText();
  return <VoiceDebug {...voiceProps} />;
};

export default function VoiceTestSimplePage() {
  return (
    <View style={styles.container}>
      <SimpleVoiceDebug />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

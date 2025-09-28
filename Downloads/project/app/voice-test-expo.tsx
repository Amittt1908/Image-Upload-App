import React from 'react';
import { View, StyleSheet } from 'react-native';
import { VoiceDebug } from '@/components/VoiceDebug';
import { useVoiceToText } from '@/hooks/useVoiceToTextExpo';

// Override the hook import for testing
const ExpoVoiceDebug = () => {
  const voiceProps = useVoiceToText();
  return <VoiceDebug {...voiceProps} />;
};

export default function VoiceTestExpoPage() {
  return (
    <View style={styles.container}>
      <ExpoVoiceDebug />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

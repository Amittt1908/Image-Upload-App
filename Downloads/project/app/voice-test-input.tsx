import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SimpleVoiceInput } from '@/components/SimpleVoiceInput';

export default function VoiceTestInputPage() {
  const [transcript, setTranscript] = useState('');

  const handleTranscriptChange = (newTranscript: string) => {
    setTranscript(newTranscript);
    console.log('Transcript updated:', newTranscript);
  };

  return (
    <View style={styles.container}>
      <SimpleVoiceInput 
        onTranscriptChange={handleTranscriptChange}
        placeholder="Type your message here..."
      />
      
      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>Result:</Text>
        <Text style={styles.resultText}>{transcript || 'No text entered yet...'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  resultContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  resultText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

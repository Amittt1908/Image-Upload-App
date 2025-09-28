import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useVoiceToText } from '@/hooks/useVoiceToText';

export const VoiceDebug: React.FC = () => {
  const { 
    transcript, 
    isListening, 
    isAvailable, 
    error, 
    startListening, 
    stopListening, 
    resetTranscript, 
    debugInfo 
  } = useVoiceToText();

  const handleDebug = () => {
    debugInfo();
    Alert.alert('Debug Info', 'Check console for detailed debug information');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Recognition Debug</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Available: {isAvailable ? '✅ Yes' : '❌ No'}
        </Text>
        <Text style={styles.statusText}>
          Listening: {isListening ? '🎤 Yes' : '🔇 No'}
        </Text>
        <Text style={styles.statusText}>
          Error: {error || 'None'}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.startButton]} 
          onPress={startListening}
          disabled={!isAvailable || isListening}
        >
          <Text style={styles.buttonText}>
            {isListening ? 'Listening...' : 'Start Listening'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.stopButton]} 
          onPress={stopListening}
          disabled={!isListening}
        >
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.resetButton]} 
          onPress={resetTranscript}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.debugButton]} 
          onPress={handleDebug}
        >
          <Text style={styles.buttonText}>Debug Info</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.transcriptContainer}>
        <Text style={styles.transcriptLabel}>Transcript:</Text>
        <Text style={styles.transcriptText}>
          {transcript || 'No speech detected yet...'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  statusContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    minWidth: '45%',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  resetButton: {
    backgroundColor: '#FF9800',
  },
  debugButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  transcriptContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transcriptLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  transcriptText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

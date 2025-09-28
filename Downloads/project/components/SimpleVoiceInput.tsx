import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';

interface SimpleVoiceInputProps {
  onTranscriptChange: (transcript: string) => void;
  placeholder?: string;
}

export const SimpleVoiceInput: React.FC<SimpleVoiceInputProps> = ({ 
  onTranscriptChange, 
  placeholder = "Type your message here..." 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleStartListening = () => {
    setIsListening(true);
    setError(null);
    
    // Show text input dialog
    Alert.prompt(
      'Voice Input',
      'Please type your message:',
      [
        { 
          text: 'Cancel', 
          style: 'cancel', 
          onPress: () => {
            setIsListening(false);
          }
        },
        { 
          text: 'OK', 
          onPress: (text) => {
            if (text && text.trim()) {
              const newTranscript = text.trim();
              setTranscript(newTranscript);
              onTranscriptChange(newTranscript);
              console.log('Text input received:', newTranscript);
            }
            setIsListening(false);
          }
        }
      ],
      'plain-text',
      transcript, // default value
      'default' // keyboard type
    );
  };

  const handleStopListening = () => {
    setIsListening(false);
  };

  const handleReset = () => {
    setTranscript('');
    setError(null);
    onTranscriptChange('');
  };

  const handleTextChange = (text: string) => {
    setTranscript(text);
    onTranscriptChange(text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Input (Text Fallback)</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Status: {isListening ? '🎤 Listening...' : '🔇 Not listening'}
        </Text>
        {error && (
          <Text style={styles.errorText}>Error: {error}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={transcript}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.startButton, isListening && styles.disabledButton]} 
          onPress={handleStartListening}
          disabled={isListening}
        >
          <Text style={styles.buttonText}>
            {isListening ? 'Listening...' : 'Start Voice Input'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.stopButton]} 
          onPress={handleStopListening}
          disabled={!isListening}
        >
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.resetButton]} 
          onPress={handleReset}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.transcriptContainer}>
        <Text style={styles.transcriptLabel}>Current Text:</Text>
        <Text style={styles.transcriptText}>
          {transcript || 'No text entered yet...'}
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
  errorText: {
    fontSize: 14,
    color: '#f44336',
  },
  inputContainer: {
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
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
    minWidth: '30%',
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
  disabledButton: {
    backgroundColor: '#ccc',
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

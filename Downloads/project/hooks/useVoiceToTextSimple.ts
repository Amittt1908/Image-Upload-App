import { useState, useEffect, useRef } from 'react';
import { Platform, Alert } from 'react-native';

export interface VoiceToTextResult {
  transcript: string;
  isListening: boolean;
  isAvailable: boolean;
  error: string | null;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  resetTranscript: () => void;
  debugInfo: () => void;
}

export function useVoiceToText(): VoiceToTextResult {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true); // Always available
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Simple Voice Recognition initialized');
    setIsAvailable(true);
  }, []);

  const startListening = async () => {
    try {
      setError(null);
      setTranscript('');
      setIsListening(true);
      
      console.log('Starting simple voice recognition...');
      
      // Show a simple text input dialog
      Alert.prompt(
        'Voice Input',
        'Voice recognition is not available. Please type your message:',
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
                setTranscript(text.trim());
                console.log('Text input received:', text);
              }
              setIsListening(false);
            }
          }
        ],
        'plain-text',
        '', // default value
        'default' // keyboard type
      );
      
    } catch (err) {
      console.error('Start listening error:', err);
      setError(`Failed to start voice recognition: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    try {
      setIsListening(false);
      console.log('Simple voice recognition stopped');
    } catch (err) {
      console.error('Stop listening error:', err);
      setError(`Failed to stop voice recognition: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const resetTranscript = () => {
    setTranscript('');
    setError(null);
  };

  const debugInfo = () => {
    console.log('=== Simple Voice Debug Info ===');
    console.log('Platform:', Platform.OS);
    console.log('Mode: Text Input Fallback');
    console.log('isAvailable state:', isAvailable);
    console.log('isListening state:', isListening);
    console.log('error state:', error);
    console.log('transcript:', transcript);
    console.log('================================');
  };

  return {
    transcript,
    isListening,
    isAvailable,
    error,
    startListening,
    stopListening,
    resetTranscript,
    debugInfo,
  };
}

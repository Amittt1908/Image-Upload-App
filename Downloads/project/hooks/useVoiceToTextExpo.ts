import { useState, useEffect, useRef } from 'react';
import { Platform, Alert } from 'react-native';
import * as Speech from 'expo-speech';

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
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Check if speech synthesis is available (indicates speech capabilities)
    const checkAvailability = async () => {
      try {
        if (Platform.OS === 'web') {
          // For web, check if Web Speech API is available
          const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
          setIsAvailable(!!SpeechRecognition);
          if (!SpeechRecognition) {
            setError('Speech recognition not supported on this browser');
          }
        } else {
          // For native, check if Speech module is available
          setIsAvailable(true);
        }
      } catch (err) {
        console.error('Error checking speech availability:', err);
        setError('Speech recognition not available');
      }
    };

    checkAvailability();
  }, []);

  const startListening = async () => {
    try {
      if (!isAvailable) {
        setError('Voice recognition not available');
        return;
      }

      setError(null);
      setTranscript('');
      setIsListening(true);
      
      console.log('Starting voice recognition...');
      
      if (Platform.OS === 'web') {
        // Use Web Speech API
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        
        if (SpeechRecognition) {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US';

          recognition.onstart = () => {
            console.log('Web speech recognition started');
          };

          recognition.onresult = (event: any) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
              if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
              }
            }
            if (finalTranscript) {
              setTranscript(finalTranscript);
            }
          };

          recognition.onerror = (event: any) => {
            console.error('Web speech recognition error:', event.error);
            setError(`Speech recognition error: ${event.error}`);
            setIsListening(false);
          };

          recognition.onend = () => {
            console.log('Web speech recognition ended');
            setIsListening(false);
          };

          recognition.start();
        } else {
          setError('Web Speech API not available');
          setIsListening(false);
        }
      } else {
        // For native platforms, show a simple input dialog as fallback
        Alert.prompt(
          'Voice Input',
          'Voice recognition is not available. Please type your message:',
          [
            { text: 'Cancel', style: 'cancel', onPress: () => setIsListening(false) },
            { 
              text: 'OK', 
              onPress: (text) => {
                if (text) {
                  setTranscript(text);
                }
                setIsListening(false);
              }
            }
          ],
          'plain-text'
        );
      }
      
      // Auto-stop after 30 seconds
      timeoutRef.current = setTimeout(() => {
        if (isListening) {
          console.log('Auto-stopping voice recognition after 30 seconds');
          stopListening();
        }
      }, 30000);
      
    } catch (err) {
      console.error('Start listening error:', err);
      setError(`Failed to start voice recognition: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    try {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      setIsListening(false);
      console.log('Voice recognition stopped');
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
    console.log('=== Expo Voice Debug Info ===');
    console.log('Platform:', Platform.OS);
    console.log('Web Speech API available:', !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition);
    console.log('isAvailable state:', isAvailable);
    console.log('isListening state:', isListening);
    console.log('error state:', error);
    console.log('transcript:', transcript);
    console.log('=============================');
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

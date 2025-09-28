import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';

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
  const [isAvailable, setIsAvailable] = useState(true); // Always available for testing
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const mockTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Simulate initialization
    console.log('Mock Voice Recognition initialized');
    setIsAvailable(true);
  }, []);

  const startListening = async () => {
    try {
      setError(null);
      setTranscript('');
      setIsListening(true);
      
      console.log('Mock voice recognition started');
      
      // Simulate speech recognition with mock data
      const mockTranscripts = [
        "Hello world",
        "This is a test",
        "Voice recognition is working",
        "Thank you for testing"
      ];
      
      let currentIndex = 0;
      const simulateSpeech = () => {
        if (isListening && currentIndex < mockTranscripts.length) {
          setTranscript(mockTranscripts[currentIndex]);
          currentIndex++;
          mockTimeoutRef.current = setTimeout(simulateSpeech, 2000);
        }
      };
      
      // Start simulation after 1 second
      mockTimeoutRef.current = setTimeout(simulateSpeech, 1000);
      
      // Auto-stop after 30 seconds
      timeoutRef.current = setTimeout(() => {
        if (isListening) {
          console.log('Auto-stopping mock voice recognition after 30 seconds');
          stopListening();
        }
      }, 30000);
      
    } catch (err) {
      console.error('Mock start listening error:', err);
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
      
      if (mockTimeoutRef.current) {
        clearTimeout(mockTimeoutRef.current);
        mockTimeoutRef.current = null;
      }
      
      setIsListening(false);
      console.log('Mock voice recognition stopped');
    } catch (err) {
      console.error('Mock stop listening error:', err);
      setError(`Failed to stop voice recognition: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const resetTranscript = () => {
    setTranscript('');
    setError(null);
  };

  const debugInfo = () => {
    console.log('=== Mock Voice Debug Info ===');
    console.log('Platform:', Platform.OS);
    console.log('Mock mode: ACTIVE');
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

import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
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
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    const initSpeechRecognition = () => {
      try {
        // Check for Web Speech API support
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        
        if (SpeechRecognition) {
          console.log('Web Speech API available');
          setIsAvailable(true);
          
          // Create recognition instance
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = true;
          recognitionRef.current.lang = 'en-US';

          // Set up event listeners
          recognitionRef.current.onstart = () => {
            console.log('Speech recognition started');
            setIsListening(true);
            setError(null);
          };

          recognitionRef.current.onresult = (event: any) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                finalTranscript += transcript;
              } else {
                interimTranscript += transcript;
              }
            }

            const currentTranscript = finalTranscript || interimTranscript;
            if (currentTranscript) {
              setTranscript(currentTranscript);
            }
          };

          recognitionRef.current.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setError(`Speech recognition error: ${event.error}`);
            setIsListening(false);
          };

          recognitionRef.current.onend = () => {
            console.log('Speech recognition ended');
            setIsListening(false);
          };

          console.log('Speech recognition initialized successfully');
        } else {
          console.log('Web Speech API not supported');
          setError('Speech recognition not supported on this device');
        }
      } catch (err) {
        console.error('Speech recognition initialization error:', err);
        setError('Failed to initialize speech recognition');
      }
    };

    initSpeechRecognition();

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log('Error stopping recognition during cleanup:', e);
        }
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const startListening = async () => {
    try {
      if (!isAvailable) {
        setError('Voice recognition not available');
        return;
      }

      if (!recognitionRef.current) {
        setError('Speech recognition not initialized');
        return;
      }

      setError(null);
      setTranscript('');
      
      console.log('Starting voice recognition...');
      
      // Start recognition
      recognitionRef.current.start();
      
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
      
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        console.log('Voice recognition stopped');
      }
      setIsListening(false);
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
    console.log('=== Voice Debug Info ===');
    console.log('Platform:', Platform.OS);
    console.log('Web Speech API available:', !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition);
    console.log('Recognition instance:', !!recognitionRef.current);
    console.log('isAvailable state:', isAvailable);
    console.log('isListening state:', isListening);
    console.log('error state:', error);
    console.log('transcript:', transcript);
    console.log('========================');
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



import { Platform } from 'react-native';
import * as Speech from 'expo-speech';
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';
import { VoiceRecognitionResult } from '@/types';

interface VoiceServiceConfig {
  language: string;
  continuous: boolean;
  interimResults: boolean;
}

class VoiceService {
  private recognition: any = null;
  private isListening: boolean = false;
  private onResultCallback: ((result: VoiceRecognitionResult) => void) | null = null;
  private config: VoiceServiceConfig = {
    language: 'en-US',
    continuous: false,
    interimResults: true,
  };

  constructor() {
    this.initializeVoice();
    if (Platform.OS === 'web') {
      this.initWebSpeechRecognition();
    }
  }

  private initializeVoice() {
    if (Platform.OS !== 'web') {
      // Initialize Voice for native platforms
      Voice.onSpeechStart = () => {
        this.isListening = true;
      };

      Voice.onSpeechEnd = () => {
        this.isListening = false;
      };

      Voice.onSpeechResults = (e: SpeechResultsEvent) => {
        if (e.value && e.value.length > 0) {
          const transcript = e.value[0] || '';
          this.onResultCallback?.({
            transcript,
            confidence: 0.9,
            isFinal: true,
          });
        }
      };

      Voice.onSpeechPartialResults = (e: SpeechResultsEvent) => {
        if (e.value && e.value.length > 0) {
          const transcript = e.value[0] || '';
          this.onResultCallback?.({
            transcript,
            confidence: 0.7,
            isFinal: false,
          });
        }
      };

      Voice.onSpeechError = (e: SpeechErrorEvent) => {
        this.isListening = false;
        console.error('Voice recognition error:', e.error);
      };
    }
  }

  private initWebSpeechRecognition() {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      // @ts-ignore
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = this.config.continuous;
      this.recognition.interimResults = this.config.interimResults;
      this.recognition.lang = this.config.language;
    }
  }

  setLanguage(language: string) {
    this.config.language = language;
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }

  async startListening(onResult?: (result: VoiceRecognitionResult) => void): Promise<string> {
    return new Promise((resolve, reject) => {
      this.onResultCallback = onResult || null;
      
      if (Platform.OS === 'web') {
        if (!this.recognition) {
          reject(new Error('Speech recognition not supported in this browser'));
          return;
        }

        let finalTranscript = '';
        let interimTranscript = '';

        this.recognition.onresult = (event: any) => {
          interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            const confidence = event.results[i][0].confidence;
            
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
              onResult?.({
                transcript: finalTranscript,
                confidence,
                isFinal: true,
              });
            } else {
              interimTranscript += transcript;
              onResult?.({
                transcript: interimTranscript,
                confidence,
                isFinal: false,
              });
            }
          }
        };

        this.recognition.onend = () => {
          this.isListening = false;
          resolve(finalTranscript);
        };

        this.recognition.onerror = (event: any) => {
          this.isListening = false;
          reject(new Error(event.error));
        };

        this.recognition.onstart = () => {
          this.isListening = true;
        };

        this.recognition.start();
      } else {
        // Use react-native-voice for native platforms
        Voice.start(this.config.language)
          .then(() => {
            this.isListening = true;
          })
          .catch((error) => {
            this.isListening = false;
            reject(error);
          });
      }
    });
  }

  stopListening() {
    if (Platform.OS === 'web' && this.recognition) {
      this.recognition.stop();
    } else if (Platform.OS !== 'web') {
      Voice.stop();
    }
    this.isListening = false;
  }

  getIsListening(): boolean {
    return this.isListening;
  }

  async speak(text: string, options?: { rate?: number; pitch?: number }): Promise<void> {
    const speechOptions = {
      rate: options?.rate || 1.0,
      pitch: options?.pitch || 1.0,
    };

    if (Platform.OS !== 'web') {
      await Speech.speak(text, speechOptions);
    } else {
      // Web speech synthesis
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = speechOptions.rate;
        utterance.pitch = speechOptions.pitch;
        speechSynthesis.speak(utterance);
      }
    }
  }

  getAvailableLanguages(): string[] {
    // Common language codes for speech recognition
    return [
      'en-US', 'en-GB', 'en-AU', 'en-CA',
      'es-ES', 'es-MX', 'fr-FR', 'de-DE',
      'it-IT', 'pt-BR', 'ru-RU', 'ja-JP',
      'ko-KR', 'zh-CN', 'hi-IN', 'ar-SA'
    ];
  }
}

export const voiceService = new VoiceService();
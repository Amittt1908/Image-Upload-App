import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Mic, MicOff, Hash, X } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { voiceService } from '@/services/voiceService';
import { galleryService } from '@/services/galleryService';

interface SmartCaptionInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  maxLength?: number;
  autoFocus?: boolean;
  onHashtagPress?: (hashtag: string) => void;
}

const SmartCaptionInput: React.FC<SmartCaptionInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Add a caption...',
  maxLength = 200,
  autoFocus = false,
  onHashtagPress,
}) => {
  const { colors } = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const extractedHashtags = galleryService.extractHashtags(value);
    setHashtags(extractedHashtags);
  }, [value]);

  useEffect(() => {
    if (isListening) {
      const pulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (isListening) pulse();
        });
      };
      pulse();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isListening, pulseAnim]);

  const handleVoiceInput = useCallback(async () => {
    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
      setInterimText('');
      return;
    }

    try {
      setIsListening(true);
      setInterimText('');

      await voiceService.startListening((result) => {
        if (result.isFinal) {
          const newText = value + (value ? ' ' : '') + result.transcript;
          onChangeText(newText);
          setInterimText('');
        } else {
          setInterimText(result.transcript);
        }
      });
    } catch (error) {
      console.error('Voice recognition error:', error);
      setIsListening(false);
      setInterimText('');
    }
  }, [isListening, value, onChangeText]);

  const insertHashtag = useCallback(() => {
    const cursorPosition = inputRef.current?.props.selection?.start || value.length;
    const beforeCursor = value.substring(0, cursorPosition);
    const afterCursor = value.substring(cursorPosition);
    
    const newText = beforeCursor + '#' + afterCursor;
    onChangeText(newText);
    
    // Focus and set cursor position after the #
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [value, onChangeText]);

  const displayText = value + (interimText ? ` ${interimText}` : '');
  const remainingChars = maxLength - value.length;

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <TextInput
          ref={inputRef}
          style={[styles.input, { color: colors.text }]}
          value={displayText}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          multiline
          maxLength={maxLength}
          autoFocus={autoFocus}
          textAlignVertical="top"
        />
        
        <View style={styles.inputActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary + '20' }]}
            onPress={insertHashtag}
          >
            <Hash color={colors.primary} size={16} />
          </TouchableOpacity>
          
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={[
                styles.voiceButton,
                {
                  backgroundColor: isListening ? colors.error + '20' : colors.primary + '20',
                }
              ]}
              onPress={handleVoiceInput}
            >
              {isListening ? (
                <MicOff color={colors.error} size={20} />
              ) : (
                <Mic color={colors.primary} size={20} />
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.hashtagContainer}>
          {hashtags.map((hashtag, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.hashtag, { backgroundColor: colors.primary + '20' }]}
              onPress={() => onHashtagPress?.(hashtag)}
            >
              <Text style={[styles.hashtagText, { color: colors.primary }]}>
                {hashtag}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.charCounter}>
          {isListening && (
            <View style={styles.listeningIndicator}>
              <ActivityIndicator color={colors.primary} size="small" />
              <Text style={[styles.listeningText, { color: colors.primary }]}>
                Listening...
              </Text>
            </View>
          )}
          <Text
            style={[
              styles.charCount,
              {
                color: remainingChars < 20 ? colors.error : colors.textSecondary,
              }
            ]}
          >
            {remainingChars}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 8,
  },
  inputActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
  voiceButton: {
    padding: 8,
    borderRadius: 8,
  },
  footer: {
    gap: 8,
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hashtag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  hashtagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  charCounter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listeningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listeningText: {
    fontSize: 14,
    fontWeight: '500',
  },
  charCount: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default SmartCaptionInput;
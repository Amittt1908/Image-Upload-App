import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const { login, register, loginWithGoogle, resetPassword } = useAuth();
  const { colors, theme } = useTheme();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setGeneralError(null); // Clear previous errors
    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData.name, formData.email, formData.password);
      }

      if (!result.success) {
        setGeneralError(result.error || 'Something went wrong');
        // Also show alert for immediate feedback
        Alert.alert('Error', result.error || 'Something went wrong');
      } else {
        // Clear any existing errors on success
        setGeneralError(null);
        setErrors({});
      }
    } catch (error) {
      const errorMessage = 'Network error. Please try again.';
      setGeneralError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address first.');
      return;
    }

    setLoading(true);
    try {
      const result = await resetPassword(formData.email);
      if (result.success) {
        Alert.alert(
          'Reset Email Sent',
          'Check your email for password reset instructions.'
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to send reset email');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await loginWithGoogle();
      if (!result.success) {
        Alert.alert('Google Login Error', result.error || 'Google login failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <LinearGradient
      colors={theme === 'dark' ? ['#1a1a2e', '#16213e'] : [colors.primary, '#4A90E2']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <BlurView intensity={20} tint={theme} style={styles.formContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </Text>
              <Text style={styles.subtitle}>
                {isLogin 
                  ? 'Sign in to access your photo gallery' 
                  : 'Join us to start capturing memories'
                }
              </Text>
            </View>

            {generalError && (
              <View style={styles.generalErrorContainer}>
                <Text style={[styles.generalErrorText, { color: colors.error }]}>
                  {generalError}
                </Text>
              </View>
            )}

            <View style={styles.form}>
              {!isLogin && (
                <View style={styles.inputContainer}>
                  <View style={[styles.inputWrapper, { borderColor: errors.name ? colors.error : colors.border }]}>
                     <User color="#666666" size={20} />
                    <TextInput
                      style={[styles.input, { color: '#000000' }]}
                      placeholder="Full Name"
                      placeholderTextColor="#666666"
                      value={formData.name}
                      onChangeText={(text) => updateFormData('name', text)}
                      autoCapitalize="words"
                      returnKeyType="next"
                    />
                  </View>
                  {errors.name && <Text style={[styles.errorText, { color: colors.error }]}>{errors.name}</Text>}
                </View>
              )}

              <View style={styles.inputContainer}>
                <View style={[styles.inputWrapper, { borderColor: errors.email ? colors.error : colors.border }]}>
                  <Mail color="#666666" size={20} />
                  <TextInput
                    style={[styles.input, { color: '#000000' }]}
                    placeholder="Email Address"
                    placeholderTextColor="#666666"
                    value={formData.email}
                    onChangeText={(text) => updateFormData('email', text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                  />
                </View>
                {errors.email && <Text style={[styles.errorText, { color: colors.error }]}>{errors.email}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <View style={[styles.inputWrapper, { borderColor: errors.password ? colors.error : colors.border }]}>
                  <Lock color="#666666" size={20} />
                    <TextInput
                      style={[styles.input, { color: '#000000' }]}
                      placeholder="Password"
                      placeholderTextColor="#666666"
                      value={formData.password}
                      onChangeText={(text) => updateFormData('password', text)}
                      secureTextEntry={!showPassword}
                      returnKeyType={isLogin ? "done" : "next"}
                    />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeOff color="#666666" size={20} />
                    ) : (
                      <Eye color="#666666" size={20} />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.password && <Text style={[styles.errorText, { color: colors.error }]}>{errors.password}</Text>}
              </View>

              {!isLogin && (
                <View style={styles.inputContainer}>
                  <View style={[styles.inputWrapper, { borderColor: errors.confirmPassword ? colors.error : colors.border }]}>
                    <Lock color="#666666" size={20} />
                    <TextInput
                      style={[styles.input, { color: '#000000' }]}
                      placeholder="Confirm Password"
                      placeholderTextColor="#666666"
                      value={formData.confirmPassword}
                      onChangeText={(text) => updateFormData('confirmPassword', text)}
                      secureTextEntry={!showPassword}
                      returnKeyType="done"
                    />
                  </View>
                  {errors.confirmPassword && <Text style={[styles.errorText, { color: colors.error }]}>{errors.confirmPassword}</Text>}
                </View>
              )}

              {isLogin && (
                <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
                  <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  { 
                    backgroundColor: colors.primary,
                    opacity: loading ? 0.7 : 1,
                  }
                ]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <>
                    <Text style={styles.submitButtonText}>
                      {isLogin ? 'Sign In' : 'Create Account'}
                    </Text>
                    <ArrowRight color="white" size={20} />
                  </>
                )}
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                <Text style={[styles.dividerText, { color: colors.textSecondary }]}>or</Text>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              </View>

              <TouchableOpacity
                style={[
                  styles.googleButton,
                  { 
                    backgroundColor: 'white',
                    opacity: loading ? 0.7 : 1,
                  }
                ]}
                onPress={handleGoogleLogin}
                disabled={loading}
              >
                <Text style={styles.googleButtonText}>🚀 Sign in with Google</Text>
              </TouchableOpacity>

              <View style={styles.switchContainer}>
                <Text style={[styles.switchText, { color: colors.textSecondary }]}>
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </Text>
                <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                  <Text style={[styles.switchButton, { color: colors.primary }]}>
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>

          <View style={styles.features}>
            <Text style={styles.featureText}>📸 Capture & organize your memories</Text>
            <Text style={styles.featureText}>🎤 Voice-powered captions</Text>
            <Text style={styles.featureText}>🔍 Smart search & hashtags</Text>
            <Text style={styles.featureText}>🌙 Beautiful themes</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  formContainer: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 14,
    marginLeft: 4,
  },
  generalErrorContainer: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  generalErrorText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -8,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 4,
  },
  switchText: {
    fontSize: 14,
  },
  switchButton: {
    fontSize: 14,
    fontWeight: '600',
  },
  features: {
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    gap: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AuthScreen;
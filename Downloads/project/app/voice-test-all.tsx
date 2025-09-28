import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function VoiceTestAllPage() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Voice Recognition Test Options</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/voice-test')}
        >
          <Text style={styles.buttonText}>Web Speech API Test</Text>
          <Text style={styles.buttonSubtext}>Uses browser's built-in speech recognition</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/voice-test-mock')}
        >
          <Text style={styles.buttonText}>Mock Test</Text>
          <Text style={styles.buttonSubtext}>Simulated voice recognition for testing</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/voice-test-expo')}
        >
          <Text style={styles.buttonText}>Expo Hybrid Test</Text>
          <Text style={styles.buttonSubtext}>Uses Expo Speech + Web API + fallback</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/voice-test-simple')}
        >
          <Text style={styles.buttonText}>Simple Text Input</Text>
          <Text style={styles.buttonSubtext}>Always works - uses text input dialog</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/voice-test-input')}
        >
          <Text style={styles.buttonText}>Advanced Text Input</Text>
          <Text style={styles.buttonSubtext}>Full text input component with real-time updates</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Test Instructions:</Text>
        <Text style={styles.infoText}>1. Try each test option to see which works best</Text>
        <Text style={styles.infoText}>2. Check console logs for detailed debug information</Text>
        <Text style={styles.infoText}>3. Mock test will always work for UI testing</Text>
        <Text style={styles.infoText}>4. Web Speech API works in modern browsers</Text>
        <Text style={styles.infoText}>5. Expo hybrid provides fallback for native</Text>
        <Text style={styles.infoText}>6. Simple Text Input always works (recommended)</Text>
        <Text style={styles.infoText}>7. Advanced Text Input provides full UI control</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  buttonContainer: {
    marginBottom: 30,
  },
  button: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  buttonSubtext: {
    fontSize: 14,
    color: '#666',
  },
  infoContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    lineHeight: 20,
  },
});

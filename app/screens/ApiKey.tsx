import { View, Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import * as WebBrowser from 'expo-web-browser';

const ApiKeyPage = () => {
  // Function to open the Hugging Face Space page in a browser
  const openHuggingFaceSpace = () => {
    WebBrowser.openBrowserAsync('https://huggingface.co/spaces/Nymbo/Qwen2.5-Coder-32B-Instruct-Serverless');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>About This App</Text>
      
      <Text style={styles.label}>
        This application uses the Qwen2.5-Coder-32B-Instruct-Serverless model hosted on Hugging Face Spaces.
      </Text>
      
      <Text style={styles.infoText}>Model Features:</Text>
      <Text style={styles.bulletPoint}>• Powerful coding assistance</Text>
      <Text style={styles.bulletPoint}>• Technical problem solving</Text>
      <Text style={styles.bulletPoint}>• General AI assistance</Text>
      
      <Text style={styles.linkLabel}>
        You can learn more about this model at:
      </Text>
      <Text style={styles.linkText} onPress={openHuggingFaceSpace}>
        huggingface.co/spaces/Nymbo/Qwen2.5-Coder-32B-Instruct-Serverless
      </Text>
      
      <Text style={styles.noteText}>
        Note: This app connects directly to the Hugging Face API and does not require an API key.
      </Text>
      
      <Pressable onPress={openHuggingFaceSpace} style={styles.button}>
        <Text style={styles.buttonText}>
          Visit Hugging Face Space
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    backgroundColor: '#0D0D0D',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 8,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
    marginTop: 4,
  },
  linkLabel: {
    fontSize: 16,
    color: '#fff',
    marginTop: 16,
  },
  linkText: {
    color: '#0F66CC',
    textDecorationLine: 'underline',
    fontSize: 16,
    marginTop: 4,
  },
  noteText: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 24,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#18191a',
    borderColor: '#2F2F2F',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignSelf: 'center',
    borderWidth: 2,
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default ApiKeyPage;
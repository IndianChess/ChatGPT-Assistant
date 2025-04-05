import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
  Platform,
  Animated,
  Easing,
  ScrollView,
} from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Role, Message, useApi } from '../hooks/useApi';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedMessage = ({ item }: { item: Message }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const isUserMessage = item.role === Role.User;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, []);

  if (isUserMessage) {
    // User message with grey bubble
    return (
      <Animated.View
        style={[
          styles.messageContainer,
          styles.userMessageBubble,
          {
            opacity: animatedValue,
            transform: [
              {
                translateY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.greyMessageBubble}>
          <Text style={styles.messageText} selectable>
            {item.content}
          </Text>
        </View>
      </Animated.View>
    );
  } else {
    // AI message with top and bottom lines
    return (
      <Animated.View
        style={[
          styles.aiMessageWrapper,
          {
            opacity: animatedValue,
            transform: [
              {
                translateY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.aiMessageLine} />
        <Text style={styles.aiMessageText} selectable>
          {item.content}
        </Text>
        <View style={styles.aiMessageLine} />
      </Animated.View>
    );
  }
};

// Preset message options
const presetMessages = [
  "How can you help me?",
  "Tell me about your features",
  "I need assistance with...",
  "What can this app do?"
];

const ChatPage = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasMessages, setHasMessages] = useState(false);
  const { getCompletion, messages } = useApi();
  const flatListRef = useRef<FlatList>(null);
  const sendButtonScale = useRef(new Animated.Value(1)).current;
  const inputBorderColor = useRef(new Animated.Value(0)).current;
  
  // Animation values for input container position
  const inputPositionAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Check if there are any messages and update state
    if (messages.length > 0 && !hasMessages) {
      setHasMessages(true);
      // Animate input to bottom position
      Animated.timing(inputPositionAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
        easing: Easing.out(Easing.cubic)
      }).start();
    }
  }, [messages, hasMessages]);

  const animateSendButton = (toValue: number) => {
    Animated.spring(sendButtonScale, {
      toValue,
      useNativeDriver: true,
    }).start();
  };

  const animateInputBorder = (toValue: number) => {
    Animated.timing(inputBorderColor, {
      toValue,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  const borderInterpolation = inputBorderColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ccc', '#A78BFA'],
  });

  const handleSendMessage = async () => {
    if (!text.trim() || loading) return;

    try {
      const messageContent = text.trim();
      setText('');
      setLoading(true);
      flatListRef.current?.scrollToEnd({ animated: true });
      
      await getCompletion(messageContent);
      
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 300);
    } catch (error) {
      console.error('Message sending failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetMessage = (message: string) => {
    setText(message);
  };

  return (
    <LinearGradient colors={['#ffffff', '#f2f2f2']} style={styles.container}>
      {hasMessages ? (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => <AnimatedMessage item={item} />}
          keyExtractor={(item, index) => `${item.role}-${index}`}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={
            loading ? (
              <ActivityIndicator 
                size="small" 
                color="#A78BFA" 
                style={styles.footerIndicator}
              />
            ) : null
          }
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      ) : (
        <View style={styles.centeredContainer}>
          {/* Welcome text right above preset messages */}
          <Text style={styles.welcomeText}>How can I help you?</Text>
          
          {/* Preset messages */}
          <View style={styles.presetContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.presetScrollContent}
            >
              {presetMessages.map((message, index) => (
                <Pressable
                  key={index}
                  style={styles.presetBubble}
                  onPress={() => handlePresetMessage(message)}
                >
                  <Text style={styles.presetText}>{message}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Input box in center */}
          <Animated.View style={[styles.inputContainer, { borderColor: borderInterpolation }]}>
            <TextInput
              style={styles.textInput}
              value={text}
              onChangeText={setText}
              placeholder="Type a message..."
              placeholderTextColor="#00000088"
              editable={!loading}
              multiline
              onFocus={() => animateInputBorder(1)}
              onBlur={() => animateInputBorder(0)}
            />
            
            <Animated.View style={{ transform: [{ scale: sendButtonScale }] }}>
              <Pressable
                style={({ pressed }) => [
                  styles.sendButton,
                  pressed && styles.sendButtonPressed,
                ]}
                onPressIn={() => animateSendButton(0.9)}
                onPressOut={() => animateSendButton(1)}
                onPress={handleSendMessage}
                disabled={loading}
              >
                <Ionicons name="send" size={20} color="white" />
              </Pressable>
            </Animated.View>
          </Animated.View>
        </View>
      )}

      {/* Bottom input when messages exist */}
      {hasMessages && (
        <Animated.View 
          style={[
            styles.bottomInputWrapper,
            {
              opacity: inputPositionAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0]
              })
            }
          ]}
        >
          <Animated.View style={[styles.inputContainer, { borderColor: borderInterpolation }]}>
            <TextInput
              style={styles.textInput}
              value={text}
              onChangeText={setText}
              placeholder="Type a message..."
              placeholderTextColor="#00000088"
              editable={!loading}
              multiline
              onFocus={() => animateInputBorder(1)}
              onBlur={() => animateInputBorder(0)}
            />
            
            <Animated.View style={{ transform: [{ scale: sendButtonScale }] }}>
              <Pressable
                style={({ pressed }) => [
                  styles.sendButton,
                  pressed && styles.sendButtonPressed,
                ]}
                onPressIn={() => animateSendButton(0.9)}
                onPressOut={() => animateSendButton(1)}
                onPress={handleSendMessage}
                disabled={loading}
              >
                <Ionicons name="send" size={20} color="white" />
              </Pressable>
            </Animated.View>
          </Animated.View>
        </Animated.View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: Platform.select({ ios: 0, android: 16 }),
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  welcomeText: {
    fontSize: 22,
    color: '#A78BFA',
    fontWeight: '600',
    marginBottom: 20,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 70,
  },
  bottomInputWrapper: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 2,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '100%',
  },
  textInput: {
    flex: 1,
    color: '#000',
    fontSize: 16,
    maxHeight: 120,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: '#A78BFA', // Solid background color instead of a gradient
    borderRadius: 20,
    padding: 12,
    overflow: 'hidden',
  },
  sendButtonPressed: {
    opacity: 0.8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 12,
  },
  // User message styles
  userMessageBubble: {
    justifyContent: 'flex-end',
    marginLeft: 'auto',
  },
  greyMessageBubble: {
    backgroundColor: '#E5E7EB',
    padding: 16,
    borderRadius: 20,
    borderBottomRightRadius: 4,
    maxWidth: '80%',
    flexShrink: 1,
    minWidth: 50,
  },
  // AI message styles
  aiMessageWrapper: {
    width: '100%',
    paddingVertical: 12,
    marginVertical: 4,
  },
  aiMessageText: {
    fontSize: 16,
    color: '#000',
    lineHeight: 24,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  aiMessageLine: {
    height: 1,
    backgroundColor: '#E5E7EB',
    width: '100%',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
    lineHeight: 22,
    flexWrap: 'wrap',
  },
  footerIndicator: {
    marginVertical: 16,
  },
  presetContainer: {
    marginBottom: 16,
    maxWidth: '100%',
  },
  presetScrollContent: {
    paddingVertical: 5,
  },
  presetBubble: {
    backgroundColor: 'rgba(167, 139, 250, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.3)',
    borderRadius: 16,
    padding: 10,
    marginHorizontal: 5,
  },
  presetText: {
    color: '#A78BFA',
    fontSize: 14,
  },
});

export default ChatPage;

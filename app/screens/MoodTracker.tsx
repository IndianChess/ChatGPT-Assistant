import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const animatedWidth = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 1000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [progress, animatedWidth]);

  return (
    <View style={styles.progressContainer}>
      <Animated.View
        style={[
          styles.progressBar,
          {
            width: animatedWidth.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  );
};

const ComingSoon = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [progress, setProgress] = useState(0);

  const floatAnim = React.useRef(new Animated.Value(0)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;
  const targetDate = new Date('2025-05-20T00:00:00').getTime();
  const startDate = new Date('2024-05-20T00:00:00').getTime(); // Customize start date

  useEffect(() => {
    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotating animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Timer calculation
    const interval = setInterval(() => {
      const now = Date.now();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });

      // Progress calculation
      const totalDuration = targetDate - startDate;
      const timePassed = now - startDate;
      const calculatedProgress = Math.min((timePassed / totalDuration) * 100, 100);
      setProgress(Math.max(calculatedProgress, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [floatAnim, rotateAnim, startDate, targetDate]);

  const floatInterpolate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={['#ffffff', '#f2f2f2', '#ffffff']}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ rotate: rotateInterpolate }],
            width: width * 0.8,
            height: width * 0.8,
          },
        ]}
      />
      
      <Animated.View style={{ transform: [{ translateY: floatInterpolate }] }}>
        <Text style={styles.title}>COMING SOON</Text>
      </Animated.View>

      <View style={styles.timerContainer}>
        <View style={styles.timeBlock}>
          <Text style={styles.timeNumber}>{timeLeft.days}</Text>
          <Text style={styles.timeLabel}>DAYS</Text>
        </View>
        <View style={styles.timeBlock}>
          <Text style={styles.timeNumber}>{timeLeft.hours}</Text>
          <Text style={styles.timeLabel}>HOURS</Text>
        </View>
        <View style={styles.timeBlock}>
          <Text style={styles.timeNumber}>{timeLeft.minutes}</Text>
          <Text style={styles.timeLabel}>MINUTES</Text>
        </View>
        <View style={styles.timeBlock}>
          <Text style={styles.timeNumber}>{timeLeft.seconds}</Text>
          <Text style={styles.timeLabel}>SECONDS</Text>
        </View>
      </View>

      <ProgressBar progress={progress} />

      <View style={styles.socialContainer}>
        {/* Add your social icons or links here */}
      </View>

      {targetDate < Date.now() && (
        <Text style={styles.launchedText}>Feature Available! 🎉</Text>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: 5,
    marginBottom: 40,
  },
  circle: {
    position: 'absolute',
    borderRadius: width * 0.4,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 30,
    width: '100%',
  },
  timeBlock: {
    alignItems: 'center',
  },
  timeNumber: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
  },
  timeLabel: {
    color: 'rgba(0,0,0,0.7)',
    fontSize: 12,
    marginTop: 5,
  },
  progressContainer: {
    height: 4,
    width: '80%',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    marginVertical: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#333',
    borderRadius: 2,
  },
  socialContainer: {
    flexDirection: 'row',
    marginTop: 40,
  },
  launchedText: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default ComingSoon;

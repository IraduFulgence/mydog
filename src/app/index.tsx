import React,{useState, useRef, useEffect} from "react";
import { router,} from "expo-router";
import { Text, View, StyleSheet,TouchableOpacity,ScrollView,Animated,Dimensions,Platform, } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { WelcomeHeader } from '@/components/landing/WelcomeHeader';
import { FeatureCard } from '@/components/landing/FeaturedCard';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';
import { typography } from '@/theme/typography';

const {height,width}= Dimensions.get('window');
export default function WelcomeScreen(): React.ReactElement{
    const [isPressed, setIsPressed] = useState(false);
   const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // adding animation effect to load my landing page
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGetStarted = (): void => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.spring(buttonScale, {
        toValue: 0.92,
        useNativeDriver: true,
        speed: 50,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
      }),
    ]).start(() => {
      router.push('/(tabs)/home');
    });
  };

  const features = [
    {
      icon: 'search' as const,
      title: 'Browse Breeds',
      description: 'Explore hundreds of dog breeds',
      color: colors.primary,
    },
    {
      icon: 'heart' as const,
      title: 'Save Favorites',
      description: 'Save your favorites breeds',
      color: colors.accent,
    },
    {
      icon: 'information-circle' as const,
      title: 'Detailed Info',
      description: 'Learn about temperament, origin, size, and more',
      color: colors.info,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <WelcomeHeader />
        
        <Animated.View 
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.featuresSection}>
            <Text style={styles.sectionSubtitle}>
              Everything you need to know about your favorite dog breeds
            </Text>
            
            <View style={styles.featuresList}>
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  color={feature.color}
                />
              ))}
            </View>
          </View>

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleGetStarted}
              onPressIn={() => setIsPressed(true)}
              onPressOut={() => setIsPressed(false)}
              style={[
                styles.getStartedButton,
                isPressed && styles.getStartedButtonPressed,
              ]}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>Start Exploring</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// styles of the whole page, 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    marginTop: -spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxxl,
    minHeight: height * 0.75,
  },
  featuresSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: 'bold' as const,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 24,
  },
  featuresList: {
    gap: spacing.sm,
  },
  getStartedButton: {
    width: '100%',
    borderRadius: borderRadius.round,
    overflow: 'hidden',
    marginTop: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  getStartedButtonPressed: {
    transform: [{ scale: 0.97 }],
  },
  gradientButton: {
    flexDirection: 'row',
    paddingVertical: Platform.OS === 'ios' ? spacing.lg : spacing.md,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 56,
  },
  buttonText: {
    color: colors.surface,
    fontSize: typography.button.fontSize,
    fontWeight: '600' as const,
    textAlign: 'center',
  },
  buttonIcon: {
    marginLeft: spacing.sm,
  },
  
});
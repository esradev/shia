import { withTiming, useSharedValue, useAnimatedStyle } from "react-native-reanimated";

export const usePanelAnimation = () => {
  const translateY = useSharedValue(500);

  const openPanel = () => {
    translateY.value = withTiming(0, { duration: 300 });
  };

  const closePanel = () => {
    translateY.value = withTiming(500, { duration: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return { transform: [{ translateY: translateY.value }] };
  });

  return { animatedStyle, openPanel, closePanel };
};

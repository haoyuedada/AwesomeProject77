import React, {ReactNode} from 'react';
import {StyleSheet, View, StyleProp, ViewStyle} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

interface ZoomableViewProps {
  children: ReactNode;
  onSingleTap?: () => void;
  minScale?: number;
  maxScale?: number;
  initialScale?: number;
  doubleTapToZoom?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

const ZoomableView: React.FC<ZoomableViewProps> = ({
  children,
  onSingleTap,
  minScale = 1,
  maxScale = 3,
  initialScale = 1,
  doubleTapToZoom = true,
  style,
  contentContainerStyle,
}) => {
  // 缩放相关状态
  const scale = useSharedValue(initialScale);
  const savedScale = useSharedValue(initialScale);
  // 位移相关状态
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  // 单击手势
  const singleTap = Gesture.Tap()
    .numberOfTaps(1)
    .maxDuration(250)
    .onEnd(() => {
      if (onSingleTap) {
        runOnJS(onSingleTap)();
      }
    });

  // 双击手势
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDuration(300)
    .onEnd(() => {
      debugger;
      if (!doubleTapToZoom) return;

      if (scale.value !== initialScale) {
        // 重置视图
        scale.value = withTiming(initialScale);
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        savedScale.value = initialScale;
      } else {
        // 放大到2倍或最大缩放值
        const targetScale = Math.min(2, maxScale);
        scale.value = withTiming(targetScale);
        savedScale.value = targetScale;
      }
    });

  // 双指捏合手势
  const pinchGesture = Gesture.Pinch()
    .onUpdate(e => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      // 限制缩放范围
      if (scale.value < minScale) {
        scale.value = withTiming(minScale);
        savedScale.value = minScale;
      } else if (scale.value > maxScale) {
        scale.value = withTiming(maxScale);
        savedScale.value = maxScale;
      } else {
        savedScale.value = scale.value;
      }
    });

  // 拖拽手势（平移）
  const panGesture = Gesture.Pan()
    .onBegin(() => {
      // 记录当前位移
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    })
    .onUpdate(e => {
      // 在缩放大于1时允许拖动；等于1时也允许轻微拖动（不做边界裁剪，避免复杂度）
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      // 结束时保持当前位置为基准
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  // 组合手势 - 关键修复
  const composedGestures = Gesture.Simultaneous(
    pinchGesture,
    panGesture,
    Gesture.Race(Gesture.Exclusive(doubleTap, singleTap)),
  );

  // 应用动画样式
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
        {scale: scale.value},
      ],
    };
  });

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={[styles.container, style]}>
        <GestureDetector gesture={composedGestures}>
          <Animated.View
            style={[styles.content, animatedStyle, contentContainerStyle]}>
            {children}
          </Animated.View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: 'black',
  },
  content: {
    width: '100%',
    height: '100%',
  },
});

export default ZoomableView;

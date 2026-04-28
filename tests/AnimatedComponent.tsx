import React, {useEffect} from 'react';
import {StyleSheet, Text, View, Button, DevSettings} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  useDerivedValue,
  runOnUI,
} from 'react-native-reanimated';

export default function AnimatedComponent({onGoBack}: {onGoBack: () => void}) {
  // 创建多个动画值（模拟真实应用中的复杂动画场景）
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const progress = useSharedValue(0);

  // 创建派生值（模拟 useDerivedValue 的使用）
  const opacity = useDerivedValue(() => {
    return 0.5 + progress.value * 0.5;
  });

  // 创建动画样式
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {scale: scale.value},
        {rotate: `${rotation.value}deg`},
      ],
      opacity: opacity.value,
    };
  });

  // 启动并发动画（组件挂载时）
  useEffect(() => {
    // Spring 动画：持续弹跳（模拟用户交互动画）
    translateX.value = withRepeat(
      withSequence(
        withSpring(100, {damping: 10, stiffness: 100}),
        withSpring(-100, {damping: 10, stiffness: 100}),
      ),
      -1, // infinite
      true, // reverse
    );

    scale.value = withRepeat(
      withSequence(
        withSpring(1.5, {damping: 8}),
        withSpring(0.8, {damping: 8}),
      ),
      -1,
      true,
    );

    // Timing 动画：无限旋转（模拟进度动画）
    rotation.value = withRepeat(
      withTiming(360, {duration: 2000, easing: Easing.linear}),
      -1,
      false,
    );

    // DerivedValue 动画：进度变化
    progress.value = withRepeat(
      withSequence(
        withTiming(1, {duration: 3000, easing: Easing.ease}),
        withTiming(0, {duration: 3000, easing: Easing.ease}),
      ),
      -1,
      true,
    );

    // 🔧 关键：使用 runOnUI() 确保调用 scheduleOnUI
    // 这是触发崩溃的核心：在 UI 线程调度持续运行的任务
    runOnUI(() => {
      'worklet';
      // 在 UI 线程中持续执行的任务
      // 当 reload 发生时，这个任务可能仍在队列中执行
      // PropsRegistry 会在 uiWorkletRuntime 销毁后析构 ShadowNode → 崩溃
      let counter = 0;
      const intervalId = setInterval(() => {
        'worklet';
        counter++;
        // 模拟持续操作（更新 shared value）
        // 这会创建 ShadowNode 并注册到 PropsRegistry
      }, 4000);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>并发动画运行中...</Text>

      <Animated.View style={[styles.box, animatedStyle]}>
        <Text style={styles.boxText}>触发崩溃</Text>
      </Animated.View>

      <Text style={styles.warning}>
        ⚠️ 动画正在运行，请选择触发方式：
      </Text>

      {/* 方式1：返回导航（不会触发析构） */}
      <Button 
        title="返回主页（不触发析构）" 
        onPress={onGoBack} 
        color="#4a5568"
      />
      
      <Text style={styles.hint}>
        只是导航返回，ReanimatedModuleProxy 不会析构
      </Text>

      {/* 方式2：Reload（真正触发析构） */}
      <Button 
        title="Reload（真正触发析构） ⚠️" 
        onPress={() => {
          // 强制重新加载整个 RN 环境
          // 会销毁旧的 ReactInstance → 触发 ReanimatedModuleProxy 析构
          DevSettings.reload();
        }}
        color="#e53e3e"
      />
      
      <Text style={styles.hint}>
        🔧 在动画运行时 reload 会触发 PropsRegistry 析构崩溃
      </Text>
      
      <Text style={styles.note}>
        原理详解：
      </Text>
      
      <Text style={styles.noteDetail}>
        1. runOnUI() 调用 ReanimatedModuleProxy::scheduleOnUI()
      </Text>
      
      <Text style={styles.noteDetail}>
        2. scheduleOnUI 将 worklet 任务调度到 UI 线程队列
      </Text>
      
      <Text style={styles.noteDetail}>
        3. reload 时，UI 线程任务可能仍在执行
      </Text>
      
      <Text style={styles.noteDetail}>
        4. 析构顺序：uiWorkletRuntime 先销毁 → PropsRegistry 后析构
      </Text>
      
      <Text style={styles.noteDetail}>
        5. PropsRegistry 中的 ShadowNode 引用已释放的 runtime → 崩溃！
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 20,
  },
  box: {
    width: 150,
    height: 150,
    backgroundColor: '#6366f1',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 30,
  },
  boxText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  warning: {
    fontSize: 14,
    color: '#e53e3e',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  hint: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
    marginTop: 15,
  },
  note: {
    fontSize: 11,
    color: '#a0aec0',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 15,
    lineHeight: 16,
    fontWeight: '600',
  },
  noteDetail: {
    fontSize: 10,
    color: '#cbd5e0',
    textAlign: 'left',
    marginTop: 3,
    marginLeft: 20,
    lineHeight: 14,
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  SensorType,
  useAnimatedSensor,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';

export default function SensorDemo() {
  // 这里用加速度计：x / y / z
  const sensor = useAnimatedSensor(SensorType.ACCELEROMETER, {
    interval: 'auto',
    adjustToInterfaceOrientation: true,
  });

  // 可选：拿到当前传感器值做日志或派生值
  useDerivedValue(() => {
    if (!sensor.isAvailable) {
      return;
    }
    const { x, y, z } = sensor.sensor.value;
    // 这里可以做 UI 线程上的计算
    // console.log('accelerometer:', x, y, z);
  });

  const animatedStyle = useAnimatedStyle(() => {
    if (!sensor.isAvailable || !sensor.sensor.value) {
      return {
        transform: [
          { perspective: 600 },
          { rotateX: '0deg' },
          { rotateY: '0deg' },
        ],
      };
    }

    const { x, y } = sensor.sensor.value;

    return {
      transform: [
        { perspective: 600 },
        // 你可以按设备倾斜程度调这个系数
        { rotateX: `${y * 12}deg` },
        { rotateY: `${-x * 12}deg` },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>useAnimatedSensor Demo</Text>
      <Text style={styles.subtitle}>
        SensorType.ACCELEROMETER
      </Text>

      <Animated.View style={[styles.card, animatedStyle]}>
        <Text style={styles.cardTitle}>Tilt Me</Text>
        <Text style={styles.cardText}>
          Move the device to see the card rotate.
        </Text>
      </Animated.View>

      <Text style={styles.footer}>
        Available: {String(sensor.isAvailable)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  card: {
    width: 260,
    height: 180,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  footer: {
    marginTop: 24,
    fontSize: 12,
    color: '#999',
  },
});
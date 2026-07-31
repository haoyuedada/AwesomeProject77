import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';

const DatePickerTestScreen = () => {
  const minDate = new Date(2025, 3, 10); // 月份从 0 开始，3 表示 4 月
  const maxDate = new Date(2026, 4, 15); // 4 表示 5 月
  const [date, setDate] = useState(minDate);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>测试日期选择器</Text>
      <Text style={styles.label}>
        当前选中日期：{date.toLocaleDateString()}
      </Text>

      <DatePicker
        date={date}
        onDateChange={setDate}
        mode="date"
        minimumDate={minDate}
        maximumDate={maxDate}
        locale="zh"
        androidVariant="nativeAndroid"
        style={styles.picker}
      />

      <Text style={styles.tip}>
        仅允许选择 2025-04-10 到 2026-05-15 之间的日期
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 20,
  },
  picker: {
    alignSelf: 'stretch',
  },
  tip: {
    marginTop: 24,
    fontSize: 14,
    color: '#555',
  },
});

export default DatePickerTestScreen;
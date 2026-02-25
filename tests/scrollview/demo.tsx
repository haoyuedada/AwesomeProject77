import React, { useState, useEffect } from 'react';
import { VirtualizedList, Button, SafeAreaView, View, StyleSheet, ScrollView, Text, StatusBar } from 'react-native';

// 1. Mock 数据 //
const MOCK_TASKS = Array.from({ length: 3 }).map((_, i) => ({
  id: `${i}`,
  title: `测试任务数据 Item - ${i}`,
  amount: (Math.random() * 1000).toFixed(2),
}));
const App = () => {
  const [rate, setRate] = useState(true);

  console.log("chy render")
  useEffect(() => {
    setRate(!rate)
  }, [])
  return (
    <>
      <VirtualizedList
        bounces={true}
        nestedScrollEnabled={false}
        overScrollMode='always'
        data={MOCK_TASKS}
        keyExtractor={item => item.id}
        getItemCount={data => data.length}
        getItem={(data, index) => data[index]}
        decelerationRate={rate ? 'fast' : 'normal'}
        renderItem={({ item }) => (
          <View>
            <Text >{item.title}</Text>
          </View>
        )}
      />
      <Button title="buttom" onPress={() => {
        console.log("chy setRate")
        setRate(!rate)
      }}></Button>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  zoomableView: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: 'pink',
    marginHorizontal: 20,
  },
  text: {
    fontSize: 42,
  },
});

export default App;
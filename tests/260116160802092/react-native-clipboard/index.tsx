import React, { useRef, useCallback } from 'react';
import {
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import { StyleSheet, Dimensions, Button } from 'react-native';
import BottomSheet from './bottomSheet.tsx';
import Lorem from './Lorem.tsx';
console.log("chy js test log")
// function clamp(val, min, max) {
//   return Math.min(Math.max(val, min), max);
// }

const { width, height } = Dimensions.get('screen');

interface BottomSheetMethods {
  expand: () => void;
  close: () => void;
}

export default function App() {
  const bottomSheetRef = useRef<BottomSheetMethods>(null);

  const pressHandler = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.container}>
        <BottomSheet
          ref={bottomSheetRef}
          snapTo={'50%'}
          backgroundColor={'white'}
          backDropColor={'black'}>
          <Lorem />
        </BottomSheet>
        <Button title="ScrollView" onPress={() => pressHandler()} />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: '#b58df1',
    borderRadius: 20,
  },
  box2: {
    width: 240,
    height: 120,
    backgroundColor: 'pink',
    // borderTopLeftRadius: '50%',
    // borderTopRightRadius: '50%',
    // borderBottomLeftRadius: '50%',
    // borderBottomRightRadius: '50%'
    borderBottomEndRadius: '50%',
    borderBottomStartRadius: '50%',
    borderTopEndRadius: '50%',
    borderTopStartRadius: '50%'
  }
});

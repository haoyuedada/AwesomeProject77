import React from 'react';
import { SafeAreaView, Image, StyleSheet, Modal } from 'react-native';
import ZoomableView from './ZoomableView';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView>
      {/* <SafeAreaView style={styles.safeArea}> */}
      <Modal
        statusBarTranslucent={true}
        navigationBarTranslucent={true}
        animationType='fade'
        visible={true}
      >
        <ZoomableView
          style={styles.zoomableView}
          contentContainerStyle={styles.contentContainer}
          doubleTapToZoom={true}
          minScale={1}
          maxScale={3}
          initialScale={1}
        >
          <Image
            source={require('../../assets/fig-without-poppy.jpeg')} 
            style={styles.image}
          />
        </ZoomableView>
        {/* </SafeAreaView> */}
      </Modal>
    </GestureHandlerRootView>
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
});

export default App;

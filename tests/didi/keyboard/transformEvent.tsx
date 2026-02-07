import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  Dimensions,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
export default function TransformEvent() {
  const [inputValue, setInputValue] = useState('input测试')
  const [popupScale, setPopupScale] = useState(1)

  const layerTapClose = () => {
    Alert.alert('触发弹层关闭事件')
  }

  const closePopup = () => {
    Alert.alert('触发弹层关闭事件')
    setPopupScale(0)
  }

  // 阻止事件冒泡：layer 内点击不关闭弹窗
  const catchTap = (e: any) => {
    // Alert.alert('触发内容事件')
    e?.stopPropagation?.()
  }

  return (
    <View style={styles.page}>
      <View
        style={styles.bottomPopupWrapper}
        onTouchEnd={layerTapClose}
      >
        <View
          style={[styles.bottomPopupLayer, { transform: [{ scale: popupScale }] }]}
          onTouchEnd={catchTap}
        >
          <TouchableOpacity style={styles.closeBtn} onPress={closePopup} activeOpacity={0.8}>
            <Text style={styles.closeBtnText}>关闭弹窗 (scale 0)</Text>
          </TouchableOpacity>
          <View style={styles.pinkBlock} />
          <TextInput
            style={styles.inputBlock}
            value={inputValue}
            onChangeText={setInputValue}
          />
          <View style={styles.pinkBlock} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  // bottom-popup-wrapper: 全屏、蓝色、点击关闭
  bottomPopupWrapper: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    bottom: 0,
    left: 0,
    backgroundColor: 'blue',
  },
  // bottom-popup-layer: 底部、红色、阻止冒泡
  bottomPopupLayer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    backgroundColor: 'red',
  },
  closeBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#333',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 16,
  },
  pinkBlock: {
    backgroundColor: 'pink',
    height: 100,
  },
  inputBlock: {
    height: 100,
    backgroundColor: '#fff',
    padding: 8,
    fontSize: 14,
  },
})
import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  Dimensions,
  Alert,
  Keyboard,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView as RnKeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform
} from 'react-native'
// import { ScrollView } from 'react-native-gesture-handler'

import { KeyboardAvoidingView, KeyboardProvider } from "@react-native-ohos/react-native-keyboard-controller";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
export default function TransformEvent() {
  const [inputValue, setInputValue] = useState('input测试')
  const [popupScale, setPopupScale] = useState(1)

  const layerTapClose = (e) => {
    // console.log('触发弹层关闭事件2222')
    Alert.alert('触发弹层关闭事件2222')
    // catchTap(e)
  }

  const closePopup = () => {
    // console.log('触发弹层关闭事件')
    Alert.alert('触发弹层关闭事件')
    setPopupScale(0)
    setTimeout(() => {
      setPopupScale(1)
    }, 1000);
  }

  // 阻止事件冒泡：layer 内点击不关闭弹窗
  const catchTap = (e: any) => {
    // Alert.alert('触发内容事件')
    e?.stopPropagation?.()
  }

  return (
    // <RnKeyboardAvoidingView
    //   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    //   style={{ flex: 1 }}>
    //   <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    //     <View
    //       style={{
    //         flex: 1,
    //         alignItems: 'center',
    //         justifyContent: 'center',
    //       }}>
    //       {/* <Image
    //         source={require('../assets/backButton.png')}
    //         style={{
    //           width: 150,
    //           height: 150,
    //           marginBottom: 30,
    //         }}
    //       /> */}
    //       <TextInput
    //         placeholder={'Input'}
    //         style={{
    //           width: 200,
    //           height: 40,
    //           paddingLeft: 15,
    //           paddingRight: 15,
    //           borderWidth: 1,
    //           borderRadius: 5,
    //           borderColor: '#cccccc',
    //         }}
    //       />
    //     </View>
    //   </TouchableWithoutFeedback>
    // </RnKeyboardAvoidingView>  // 官方避让组件    不嵌套会避让               嵌套会避让               开启安全区扩展后 嵌套会避让（符合预期）
    <View style={styles.page}>
        <View
          style={styles.bottomPopupWrapper}
          onTouchEnd={layerTapClose}
        >
          {/* <ScrollView> */}
          <View
            style={[styles.bottomPopupLayer, { transform: [{ scale: popupScale }] }]}
            onTouchEnd={catchTap}
          >
            {/* <ScrollView > */}
              <TouchableOpacity style={styles.closeBtn} onPress={closePopup} activeOpacity={0.8}>
                <Text style={styles.closeBtnText}>关闭弹窗 (scale 0)</Text>
              </TouchableOpacity>
              <View style={styles.pinkBlock} />
                <TextInput
                  style={styles.inputBlock}
                  value={inputValue}
                  onChangeText={setInputValue}
                />
              <View style={styles.pinkBlock2} />
            {/* </ScrollView> */}
          </View>
          {/* </ScrollView> */}
        </View>
    </View>                    // 普通组件       不嵌套不避让                嵌套会避让(不符合预期)    开启安全区扩展后 嵌套不避让（符合预期）
    // <KeyboardProvider>
    //         <KeyboardAvoidingView style={{
    //             padding: 22,
    //             flex: 1,
    //             height:"100%",
    //             justifyContent: "space-between",
    //             backgroundColor:'pink'
    //         }}
    //         behavior='position'>
    //             <Text style={{
    //                 color: "black",
    //                 fontSize: 25,
    //                 marginTop: 400,
    //                 fontWeight: "500"
    //             }}>react-native-keyboard-controller</Text>
    //             <View>
    //                 <TextInput
    //                     placeholder="Username"
    //                     placeholderTextColor="#7C7C7C"
    //                     style={{
    //                         height: 45,
    //                         borderColor: "#000000",
    //                         borderWidth: 1,
    //                         borderRadius: 10,
    //                         marginBottom: 36,
    //                         paddingLeft: 10,
    //                     }}
    //                 />
    //                 <TextInput
    //                     placeholder="Password"
    //                     placeholderTextColor="#7C7C7C"
    //                     style={{
    //                         height: 45,
    //                         borderColor: "#000000",
    //                         borderWidth: 1,
    //                         borderRadius: 10,
    //                         marginBottom: 36,
    //                         paddingLeft: 10,
    //                     }}
    //                 />
    //                 <TouchableOpacity style={{
    //                     marginTop: 40,
    //                     height: 45,
    //                     borderRadius: 10,
    //                     backgroundColor: "rgb(40, 64, 147)",
    //                     justifyContent: "center",
    //                     alignItems: "center",
    //                 }}>
    //                     <Text style={{
    //                         fontWeight: "500",
    //                         fontSize: 16,
    //                         color: "white",
    //                     }}>Submit</Text>
    //                 </TouchableOpacity>
    //             </View>
    //         </KeyboardAvoidingView>
    // </KeyboardProvider>           // 三方库避让组件  不嵌套不避让（库功能异常）   嵌套会避让(不符合预期)    开启安全区扩展后 嵌套不避让（符合预期）

      // 现象总结 开启安全区域扩展后 嵌套后避让原则与原本保持一致
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
  pinkBlock2: {
    backgroundColor: 'pink',
    height: 200,
  },
  inputBlock: {
    height: 40,
    backgroundColor: '#fff',
    padding: 8,
    fontSize: 14,
  },
})
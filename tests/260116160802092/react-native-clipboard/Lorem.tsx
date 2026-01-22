import { StyleSheet, Text, View, 
  // ScrollView
 } from 'react-native'
import React from 'react'
import { 
  ScrollView 
} from 'react-native-gesture-handler'

const lorem1 = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Quisque porta faucibus turpis, a auctor justo tempus vitae.
Morbi pellentesque massa felis, vitae ultrices turpis condimentum eu.
Aliquam nunc velit, volutpat sit amet lobortis at, cursus ac mauris.`

const lorem2 = `Nunc a convallis ligula.
Nunc quis accumsan augue, lobortis ornare diam.
Aenean euismod nunc sed luctus sollicitudin.
Donec ultricies est ante.
In gravida sed lectus eu hendrerit.`

const Lorem = () => {
  return (
    <View>
      {/* <Text style={styles.text}>{lorem1}</Text> */}
      <ScrollView scrollEnabled={false} style={{ backgroundColor: 'red'}}>
        {/*
         1. 高度足够的时候 默认不开启滚动 鸿蒙默认开启 可设置
         style={{
           height: 300
         }}
         2. 强制设置 scrollEnabled={false} 不可滚动时 正常应响应外层手势 鸿蒙不响应
         */}
        <Text style={styles.text}>{lorem2}</Text>
      </ScrollView>
    </View>
  )
}

export default Lorem

const styles = StyleSheet.create({
  text: {
    padding: 10,
    color: 'black',
  },
})

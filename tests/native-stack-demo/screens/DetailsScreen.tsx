import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'

const DetailsScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>详情页</Text>
      <Text style={styles.subtitle}>这是 RN 路由的 Details Screen</Text>
      <Button
        title="返回首页"
        onPress={() => navigation.goBack()}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef6ff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
})

export default DetailsScreen

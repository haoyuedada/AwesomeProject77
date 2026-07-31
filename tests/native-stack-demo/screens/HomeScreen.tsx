import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'

const HomeScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>首页</Text>
      <Text style={styles.subtitle}>这是 RN 路由的 Home Screen</Text>
      <Button
        title="去详情页"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
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

export default HomeScreen

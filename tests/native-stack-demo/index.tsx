import React from 'react'
import { enableScreens } from 'react-native-screens'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import HomeScreen from './screens/HomeScreen'
import DetailsScreen from './screens/DetailsScreen'

// 启用原生 screen,配合 native-stack 使用
enableScreens(true)

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          gestureEnabled: true, // 禁用手势滑动返回
          headerStyle: { backgroundColor: '#4a90d9' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        //   gesturesEnabled: true,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: '首页' }}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{ title: '详情' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

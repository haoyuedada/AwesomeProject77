import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import TransformEvent from './transformEvent';
// import { enableScreens } from 'react-native-screens';
// enableScreens(false)

const Stack = createNativeStackNavigator()
export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={TransformEvent} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
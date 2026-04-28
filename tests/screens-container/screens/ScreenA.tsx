import { StyleSheet, Text, View, Button, TextInput } from 'react-native'

const ScreenA = () => {
  const handlePress = () => {
    console.log('handlePressA')
    console.log('test js handlePressA')
  }
  return (
    <View style={[styles.container, {backgroundColor: 'red'}]}>      
      <Text>Screen A</Text>
      <TextInput  style={{height: 50, width: 120, backgroundColor: '#ffffff'}}>Screen A</TextInput>
      <Button
        title="Press"
        onPress={handlePress}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
})

export default ScreenA

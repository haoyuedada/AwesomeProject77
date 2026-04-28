import { StyleSheet, Text, View, Button, TextInput } from 'react-native'

const ScreenB = () => {
  const handlePressB = () => {
    console.log('handlePressB')
    console.log('test js handlePressB')
  }
  return (
    <View style={[styles.container, {backgroundColor: 'blue'}]} >
      <Text>Screen B</Text>
      <TextInput style={{height: 50, width: 120, backgroundColor: '#ffffff'}}>Screen B</TextInput>
      <Button
        title="Press"
        onPress={handlePressB}
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

export default ScreenB

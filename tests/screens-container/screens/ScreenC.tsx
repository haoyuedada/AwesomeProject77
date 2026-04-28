import { StyleSheet, Text, View, Button, TextInput } from 'react-native'

const ScreenC = () => {
  const handlePressC = () => {
    console.log('handlePressC')
    console.log('test js handlePressC')
  }
  return (
    <View style={[styles.container, {backgroundColor: 'green'}]}>
      <TextInput style={{height: 50, width: 120, backgroundColor: '#ffffff'}}>Screen c</TextInput>
      <Text>Screen C</Text>
      
      <Button
        title="Press"
        onPress={handlePressC}
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

export default ScreenC

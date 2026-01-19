import { StyleSheet, Text, View, Button } from 'react-native'

const ScreenC = () => {
  const handlePress = () => {
    console.log('handlePressC')
  }
  return (
    <View style={[styles.container, {backgroundColor: 'green'}]}>
      <Text>Screen C</Text>
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

export default ScreenC

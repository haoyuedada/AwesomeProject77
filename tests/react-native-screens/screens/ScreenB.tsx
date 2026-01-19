import { StyleSheet, Text, View, Button } from 'react-native'

const ScreenB = () => {
  const handlePress = () => {
    console.log('handlePressB')
  }
  return (
    <View style={[styles.container, {backgroundColor: 'blue'}]}>
      <Text>Screen B</Text>
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

export default ScreenB

import { StyleSheet, Text, View, Button } from 'react-native'

const ScreenA = () => {
  const handlePress = () => {
    console.log('handlePressA')
  }
  return (
    <View style={[styles.container, {backgroundColor: 'red'}]}>
      <Text>Screen A</Text>
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

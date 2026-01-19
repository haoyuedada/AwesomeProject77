import { useState } from 'react'
import { StyleSheet, View, Button, Text } from 'react-native'
import { ScreenContainer, Screen } from 'react-native-screens'
import ScreenA from './screens/ScreenA'
import ScreenB from './screens/ScreenB'
import ScreenC from './screens/ScreenC'

type ActivityState = 0 | 1 | 2

const ScreenWrapper: React.FC<{
  activityStateA: ActivityState
  activityStateB: ActivityState
  activityStateC: ActivityState
}> = (props) => {
  return (
    <ScreenContainer style={styles.screenContainer}>
      <Screen activityState={props.activityStateA}>
        <ScreenA />
      </Screen>
      <Screen activityState={props.activityStateB}>
        <ScreenB />
      </Screen>
      <Screen activityState={props.activityStateC}>
        <ScreenC />
      </Screen>
    </ScreenContainer>
  )
}

const ControllerItem: React.FC<{
  title: string
  onPress0: () => void
  onPress1: () => void
  onPress2: () => void
}> = (props) => {
  return (
    <View style={{ flex: 1, padding: 10, borderWidth: 1, gap: 10 }}>
      <Text>{props.title}</Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button title="0" onPress={props.onPress0} />
        <Button title="1" onPress={props.onPress1} />
        <Button title="2" onPress={props.onPress2} />
      </View>
    </View>
  )
}
const ActivityController: React.FC<{
  activityStateA: ActivityState
  activityStateB: ActivityState
  activityStateC: ActivityState
  setActivityStateA: (state: ActivityState) => void
  setActivityStateB: (state: ActivityState) => void
  setActivityStateC: (state: ActivityState) => void
}> = (props) => {
  return (
    <View style={{ flexDirection: 'row', padding: 10, borderWidth: 1, gap: 10 }}>
      <ControllerItem
        title={`A: ${props.activityStateA}`}
        onPress0={() => props.setActivityStateA(0)}
        onPress1={() => props.setActivityStateA(1)}
        onPress2={() => props.setActivityStateA(2)}
      />
      <ControllerItem
        title={`B: ${props.activityStateB}`}
        onPress0={() => props.setActivityStateB(0)}
        onPress1={() => props.setActivityStateB(1)}
        onPress2={() => props.setActivityStateB(2)}
      />
      <ControllerItem
        title={`C: ${props.activityStateC}`}
        onPress0={() => props.setActivityStateC(0)}
        onPress1={() => props.setActivityStateC(1)}
        onPress2={() => props.setActivityStateC(2)}
      />
    </View>
  )
}

const RootView = () => {
  const [activityStateA, setActivityStateA] = useState<ActivityState>(2)
  const [activityStateB, setActivityStateB] = useState<ActivityState>(0)
  const [activityStateC, setActivityStateC] = useState<ActivityState>(0)
  return (
    <View style={styles.container}>
      <ScreenWrapper
        activityStateA={activityStateA}
        activityStateB={activityStateB}
        activityStateC={activityStateC}
      />
      <ActivityController
        activityStateA={activityStateA}
        activityStateB={activityStateB}
        activityStateC={activityStateC}
        setActivityStateA={setActivityStateA}
        setActivityStateB={setActivityStateB}
        setActivityStateC={setActivityStateC}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
    paddingBottom: 80,
    gap: 20,
  },
  screenContainer: {
    // flex: 1,
    height: 400,
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: '#ccc',
  },
})

export default RootView

import { useState } from "react";
import { Text, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView, State, TapGestureHandler, TouchableWithoutFeedback } from "react-native-gesture-handler";
import Animated, { runOnJS, runOnUI, scrollTo, useAnimatedProps, useAnimatedRef, useAnimatedScrollHandler, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from "react-native-reanimated";


enum E_ListScrollState {
    Padding = 'padding',
    Active = 'active',
    Fail = 'fail'
}

enum E_PanPosition {
    None = 'none',
    Left = 'left',
    Right = 'right'
}

const LOADING_HEIGHT = 48;
const LeftListWidth = 80;

export default function NestedScrollView() {
    const { height: windowHeight } = useWindowDimensions();

    const [activeIndex, setActiveIndex] = useState(0)

    const activeI = useDerivedValue(() => {
        return activeIndex
    })


    const stickyTop = useSharedValue(0)
    const outerScrollY = useSharedValue(0)
    const rightScrollY = useSharedValue(0)
    const leftScrollY = useSharedValue(0)
    const startY = useSharedValue(0)
    const leftStartY = useSharedValue(0)
    const outStartY = useSharedValue(0)
    const topStartY = useSharedValue(0)
    const rightListScrollState = useSharedValue<E_ListScrollState>(E_ListScrollState.Padding)
    const leftListScrollState = useSharedValue<E_ListScrollState>(E_ListScrollState.Padding)
    const topLastDirection = useSharedValue<'' | 'up' | 'down'>('')
    const freshElAnimatedY = useSharedValue(0)
    const panPosition = useSharedValue<E_PanPosition>(E_PanPosition.None)

    const printLog = (...args) => {
        // console.log(...args);
    };


    const getLeftListState = (direction): E_ListScrollState => {
        'worklet';
        leftListScrollState.value = E_ListScrollState.Padding
        if (panPosition.value === E_PanPosition.Right) {
            return leftListScrollState.value;
        }
        if (direction === 'up') {
            if (outerScrollY.value < stickyTop.value) {
                runOnJS(printLog)('getLeftListState ----- 1111', outerScrollY.value, stickyTop.value)
                leftListScrollState.value = E_ListScrollState.Fail
            } else {
                runOnJS(printLog)('getLeftListState ----- 222', outerScrollY.value, stickyTop.value)
                leftListScrollState.value = E_ListScrollState.Active
            }
        } else {
            if (leftScrollY.value > 0) {
                runOnJS(printLog)('getLeftListState ----- 3333', leftScrollY.value)
                leftListScrollState.value = E_ListScrollState.Active
            } else {
                runOnJS(printLog)('getLeftListState ----- 4444', leftScrollY.value)
                leftListScrollState.value = E_ListScrollState.Fail
            }
        }
        // runOnJS(printLog)('getAndControlLeftList ----- 1111', leftListScrollState.value)
        return leftListScrollState.value
    }

    const getRightListState = (direction): E_ListScrollState => {
        'worklet';
        rightListScrollState.value = E_ListScrollState.Padding
        if (panPosition.value === E_PanPosition.Left) {
            return rightListScrollState.value;
        }
        if (direction === 'up') {
            if (outerScrollY.value < stickyTop.value) {
                rightListScrollState.value = E_ListScrollState.Fail
            } else {
                rightListScrollState.value = E_ListScrollState.Active
            }
        } else {
            if (rightScrollY.value > 0) {
                rightListScrollState.value = E_ListScrollState.Active
            } else {
                rightListScrollState.value = E_ListScrollState.Fail
            }
        }
        return rightListScrollState.value;
    }



    const outVirturePan = Gesture.Pan()
        .onBegin(event => {
            'worklet';
            outStartY.value = event.y;
            runOnJS(printLog)('outVirturePan onBegin', event.y)
        })
        .onTouchesMove((_, manager) => {
            'worklet';
            console.log("outVirturePan => onTouchesMove");
            panPosition.value = _.changedTouches[0].absoluteX >= LeftListWidth ? E_PanPosition.Right : E_PanPosition.Left;
            if (_.changedTouches[0].y === outStartY.value) {
                return
            }
            const direction = _.changedTouches[0].y - outStartY.value < 0 ? 'up' : 'down'
            outStartY.value = _.changedTouches[0].y;

            // const direction = topLastDirection.value;

            const leftScrollState = getLeftListState(direction)
            const rightScrollState = getRightListState(direction)

            if (rightScrollState === E_ListScrollState.Padding && leftScrollState === E_ListScrollState.Padding) {
                runOnJS(printLog)('outVirturePan - 等待LeftList or RighList确定他是否需要滚动')
                return;
            }

            if (rightScrollState === E_ListScrollState.Active || leftScrollState === E_ListScrollState.Active) {
                runOnJS(printLog)('outVirturePan - 等待List ...  处理  ... ', rightScrollState === E_ListScrollState.Active ? 'rightlist' : 'leftlist')
                return;
            }


            runOnJS(printLog)('outVirturePan - onTouchesMove', direction, _.changedTouches[0].y, outStartY.value)


            if (direction === 'down' && outerScrollY.value <= stickyTop.value) {
                runOnJS(printLog)('outVirturePan activeI.value ---', direction, panPosition.value, activeI.value, rightScrollY.value)

                if (rightScrollY.value <= 0 && outerScrollY.value < stickyTop.value) {
                    console.log("chy outVirturePan->onTouchesMove fail")
                    manager.fail()
                } else if (panPosition.value === E_PanPosition.Right && activeI.value !== 0) {
                    console.log("chy outVirturePan->onTouchesMove activate")
                    manager.activate();
                    return
                }
                else if (panPosition.value === E_PanPosition.Right && rightScrollY.value > 0) {
                    // manager.activate()
                } else if (panPosition.value === E_PanPosition.Left && leftScrollY.value > 0) {
                    // manager.activate()
                }
            } else if (direction === 'up' && outerScrollY.value >= stickyTop.value) {
                runOnJS(printLog)('outVirturePan -- 2--2--', direction, outerScrollY.value, stickyTop.value)
                // manager.activate();
                return
            }
            runOnJS(printLog)('outVirturePan -- 3--3--');
            console.log("chy outVirturePan->onTouchesMove fail2")
            manager.fail();

        })
        .manualActivation(true)
        .minDistance(99999)

    const tapGesture = Gesture.Pan()
        .onBegin(event => {
            'worklet';
            rightListScrollState.value = E_ListScrollState.Padding
            startY.value = event.y;
            runOnJS(printLog)('tapGesture onBegin', event.y)
        })
        .onTouchesMove((_, manager) => {
            'worklet';
            console.log('tapGesture onTouchesMoveIn')
            runOnJS(printLog)('tapGesture onTouchesMoveIn')
            panPosition.value = _.changedTouches[0].absoluteX >= LeftListWidth ? E_PanPosition.Right : E_PanPosition.Left;
            if (_.changedTouches[0].y === startY.value) {
                return
            }
            const direction = _.changedTouches[0].y - startY.value < 0 ? 'up' : 'down'
            runOnJS(printLog)('tapGesture onTouchesMove', direction, _.changedTouches[0].y, startY.value)
            startY.value = _.changedTouches[0].y;

            if (panPosition.value === E_PanPosition.Left) {
                // manager.end()
                return
            }
            // const direction = topLastDirection.value;
            // runOnJS(printLog)('outerScrollY.value < stickyTop.value', direction, outerScrollY.value < stickyTop.value || rightScrollY.value > 0, _.changedTouches[0].y);

            const state = getRightListState(direction)
            runOnJS(printLog)('tapGesture getRightListState ----- 1111', state)
            if (state === E_ListScrollState.Active) {
                console.log("chy tapGesture => onTouchesMove fail:")
                manager.fail()
            } else {
                console.log("chy tapGesture => onTouchesMove activate:")
                manager.activate();
            }
        })
        .onUpdate(event => {
            runOnJS(printLog)('tapGesture --- onUpdate', event.velocityY)
        })
        .onChange(event => {
            if (panPosition.value === E_PanPosition.Right && rightScrollY.value === 0 && outerScrollY.value >= stickyTop.value && activeI.value !== 0) {
                // console.log('topPanGesture event.translationY', event.translationY)
                freshElAnimatedY.value = Math.min(LOADING_HEIGHT, freshElAnimatedY.value + event.changeY);
            }
        })
        .onFinalize(() => {
            freshElAnimatedY.value = withSpring(
                0,
                {
                    stiffness: 300,
                    overshootClamping: true
                }
            )
        })
        .manualActivation(true)
        .minDistance(99999)
    // .activeOffsetY([0, 3])

    // 当outVirturePan失败时，外层的 scrollview 才能滚动。
    const outScrollGesture = Gesture.Native()
        .onTouchesMove((event) => {
            console.log('outScrollGesture onTouchesMoveIn')
            // console.log('outScrollGesture', event)
        })
        .requireExternalGestureToFail(outVirturePan)


    const scrollGesture = Gesture.Native()
        .requireExternalGestureToFail(tapGesture)

    const tapGestureForLeft = Gesture.Pan()
        .onBegin(event => {
            'worklet';
            leftStartY.value = event.y;
            leftListScrollState.value = E_ListScrollState.Padding
            runOnJS(printLog)('tapGestureForLeft onBegin', event.y)
        })
        .onTouchesMove((_, manager) => {
            'worklet';
            // const direction = topLastDirection.value;
            console.log('tapGestureForLeft onTouchesMoveIn')
            panPosition.value = _.changedTouches[0].absoluteX >= LeftListWidth ? E_PanPosition.Right : E_PanPosition.Left;
            if (_.changedTouches[0].y === leftStartY.value) {
                return
            }
            const direction = _.changedTouches[0].y - leftStartY.value < 0 ? 'up' : 'down'
            leftStartY.value = _.changedTouches[0].y;

            if (panPosition.value === E_PanPosition.Right) {
                return
            }
            runOnJS(printLog)('tapGestureForLeft ----- 0000', direction, _.allTouches[0].absoluteX)

            const state = getLeftListState(direction);
            runOnJS(printLog)('tapGestureForLeft getAndControlLeftList ----- 1111', state)
            if (state === E_ListScrollState.Active) {
                console.log("chy tapGestureForLeft->onTouchesMove fail")
                manager.fail()
            } else {
                manager.end();
            }

        })
        .manualActivation(true)
        .minDistance(99999)
        .simultaneousWithExternalGesture(outVirturePan, outScrollGesture)

    const leftScrollGesture = Gesture.Native()
        .requireExternalGestureToFail(tapGestureForLeft)


    const scrollHandler = useAnimatedScrollHandler({
        onScroll: e => {
            'worklet';
            outerScrollY.value = e.contentOffset.y;
        },
    });

    const refRightlist = useAnimatedRef();


    const topPanGesture = Gesture.Pan()
        .onBegin(event => {
            topLastDirection.value = '';
            runOnJS(printLog)('topPanGesture onBegin', event.y)
            topStartY.value = event.y;

            // panPosition.value = event.absoluteX >= leftListWidth ? E_PanPosition.Right : E_PanPosition.Left;
        })
        .onTouchesMove((_, manager) => {
            'worklet';
            // if (rightListScrollState.value === E_ListScrollState.Active) {
            //     runOnJS(printLog)('topPanGesture - 等待RighList ...  处理  ... ')
            //     manager.end()
            //     return;
            // }

            // if (_.changedTouches[0].y - topStartY.value === 0) {
            //     return
            // }

            const diff = _.changedTouches[0].y - topStartY.value;
            const direction = diff < 0 ? 'up' : 'down'
            // console.log('topPanGesture ===> onTouchesMove == direction', direction, _.changedTouches[0].y, topStartY.value)
            topLastDirection.value = direction;
            topStartY.value = _.changedTouches[0].y
            // console.log('topPanGesture manager.activate')
            // manager.activate();

            // console.log('topPanGesture ===> direction', direction)

            // console.log('topPanGesture rightScrollY.value  =>> ', rightScrollY.value, diff)
            // if (rightScrollY.value === 0) {
            //     rightScrollY1.value = rightScrollY1.value - diff;

            //     scrollTo(refRightlist, 0, rightScrollY1.value, false);
            // }

        })
        .onChange(event => {
            'worklet';
            // if (panPosition.value === E_PanPosition.Right && rightScrollY.value === 0 && outerScrollY.value >= stickyTop.value && activeI.value !== 0) {
            //     console.log('topPanGesture event.translationY', event.translationY)
            //     freshElAnimatedY.value = Math.min(LOADING_HEIGHT, freshElAnimatedY.value + event.changeY);
            // }
            // console.log('topPanGesture rightScrollY.value  =>> ', rightScrollY1.value - event.changeY, event.changeY)
            // if (rightScrollY.value === 0) {
            //     rightScrollY1.value =  rightScrollY1.value - event.changeY;

            //     // scrollTo(refRightlist, 0, 50, false);
            // }
        })
        .onFinalize(() => {
            // freshElAnimatedY.value = withSpring(
            //     0,
            //     {
            //         stiffness: 300,
            //         overshootClamping: true
            //     }
            // )
            // panPosition.value = E_PanPosition.None;
            // topLastDirection.value = '';
        })
        .requireExternalGestureToFail(tapGesture)
        .simultaneousWithExternalGesture(outVirturePan, tapGesture, tapGestureForLeft, outScrollGesture)


    // useDerivedValue(() => {
    //     scrollTo(refRightlist, 0, rightScrollY.value, true);
    // });

    // outScrollGesture.simultaneousWithExternalGesture(topPanGesture)


    // tapGesture.simultaneousWithExternalGesture(outVirturePan, outScrollGesture, topPanGesture)
    tapGesture.simultaneousWithExternalGesture(outVirturePan, outScrollGesture)


    const rightScrollHandler = useAnimatedScrollHandler({
        onScroll: e => {
            // 'worklet';
            rightScrollY.value = e.contentOffset.y;
        },
    });

    const leftScrollHandler = useAnimatedScrollHandler({
        onScroll: e => {
            // 'worklet';
            leftScrollY.value = e.contentOffset.y;
        },
    });

    const animatedStyles = useAnimatedStyle(() => {
        'worklet';
        // canAnimateFreshEl.value ? 
        return {
            transform: [{
                translateY: freshElAnimatedY.value
            }]
        };
    });

    return (
        <GestureHandlerRootView>
            {/* <GestureDetector gesture={topPanGesture}> */}
            <Animated.View style={[{ height: windowHeight, paddingTop: 88 }]}>
                <GestureDetector
                    gesture={Gesture.Simultaneous(outVirturePan, tapGesture, tapGestureForLeft)}
                >
                    <Animated.View style={{ flex: 1 }}>
                        <GestureDetector
                            gesture={Gesture.Simultaneous(outScrollGesture)}
                        >
                            <Animated.ScrollView
                                style={{
                                    backgroundColor: '#3ffff0'
                                }}
                                onScroll={scrollHandler}
                                scrollEventThrottle={1}
                                bounces={false}
                                showsVerticalScrollIndicator={false}
                            >
                                <View style={{ borderWidth: 1 }}>
                                    {
                                        Array(20)
                                            .fill(1)
                                            .map((_, index) => (
                                                <Text key={index}>{index}</Text>
                                            ))
                                    }
                                </View>
                                <Animated.View
                                    style={{
                                        height: windowHeight - 88,
                                        flexDirection: 'row'
                                    }}
                                    onLayout={(e) => {
                                        stickyTop.value = e.nativeEvent.layout.y;
                                        // console.log('stickyTop initialized:', e.nativeEvent.layout.y);
                                    }}>

                                    <GestureDetector gesture={Gesture.Simultaneous(leftScrollGesture)}>
                                        <Animated.ScrollView
                                            style={{
                                                backgroundColor: '#3ffff0',
                                                width: LeftListWidth,
                                                height: '100%',
                                                flexGrow: 0,
                                            }}
                                            onScroll={leftScrollHandler}
                                            bounces={false}
                                            nestedScrollEnabled={false}
                                            showsVerticalScrollIndicator={false}
                                        >
                                            {
                                                Array(100)
                                                    .fill(1)
                                                    .map((_, index) => (
                                                        <TapGestureHandler
                                                            onHandlerStateChange={({ nativeEvent }) => {
                                                                if (nativeEvent.state === State.END) {
                                                                    setActiveIndex(index)
                                                                }
                                                            }}
                                                        >

                                                            <View key={index}
                                                                style={{ height: 30, backgroundColor: '#FFF', borderBottomWidth: 1, alignItems: 'center', justifyContent: 'center' }}
                                                            >
                                                                <Text style={[activeIndex === index && { color: 'red' }]}>{index}</Text>
                                                            </View>
                                                        </TapGestureHandler>
                                                    ))
                                            }
                                        </Animated.ScrollView>
                                    </GestureDetector>
                                    <View style={{ height: '100%', width: 1, backgroundColor: 'black' }}></View>
                                    <View style={{ flex: 1, overflow: 'hidden' }}>
                                        <Animated.View
                                            style={[
                                                {
                                                    height: LOADING_HEIGHT,
                                                    position: 'absolute',
                                                    top: -LOADING_HEIGHT,
                                                    width: '100%',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                    zIndex: 2,
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                },
                                                animatedStyles
                                            ]}
                                        >
                                            <Text style={{ color: '#8C8C8C', fontSize: 11 }}>下滑逛逛上一个</Text>
                                        </Animated.View>
                                        <GestureDetector
                                            gesture={Gesture.Simultaneous(scrollGesture)}>
                                            <Animated.ScrollView
                                                style={{
                                                    backgroundColor: '#3ffff0',
                                                    flex: 1,
                                                    height: '100%'
                                                }}
                                                ref={refRightlist}
                                                bounces={false}
                                                nestedScrollEnabled={false}
                                                onScroll={rightScrollHandler}
                                                scrollEventThrottle={1}
                                                showsVerticalScrollIndicator={false}
                                            >
                                                {
                                                    Array(100)
                                                        .fill(1)
                                                        .map((_, index) => (
                                                            <Text key={index}>{index}</Text>
                                                        ))
                                                }
                                            </Animated.ScrollView>
                                        </GestureDetector>
                                    </View>
                                </Animated.View>
                            </Animated.ScrollView>
                        </GestureDetector>

                    </Animated.View>

                </GestureDetector>
            </Animated.View>

            {/* </GestureDetector> */}
        </GestureHandlerRootView >
    )
}
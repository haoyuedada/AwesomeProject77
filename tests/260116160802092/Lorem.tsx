import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'

const lorem1 = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Quisque porta faucibus turpis, a auctor justo tempus vitae.
Morbi pellentesque massa felis, vitae ultrices turpis condimentum eu.
Aliquam nunc velit, volutpat sit amet lobortis at, cursus ac mauris.`

const lorem2 = `Nunc a convallis ligula.
Nunc quis accumsan augue, lobortis ornare diam.
Aenean euismod nunc sed luctus sollicitudin.
Donec ultricies est ante.
In gravida sed lectus eu hendrerit.`

const Lorem = () => {
    return (
        <View>
            {/* <Text style={styles.text}>{lorem1}</Text> */}
            {/* <ScrollView style={{ backgroundColor: 'red', height: 300 }}> */}
            <ScrollView scrollEnabled={false} style={{ backgroundColor: 'red' }}>
                {/*
1. 高度足够的时候 默认不开启滚动 鸿蒙默认开启 可设置
style={{
height: 300
}}
2. 强制设置 scrollEnabled={false} 不可滚动时 正常应响应外层手势 鸿蒙不响应
*/}
                <Text style={styles.text}>{lorem2}</Text>
            </ScrollView>
        </View>
    )
}

export default Lorem

const styles = StyleSheet.create({
    text: {
        padding: 10,
        color: 'black',
    },
})
index.tsx：
import React, { useRef, useCallback } from 'react';
import {
    GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, Dimensions, Button } from 'react-native';
import BottomSheet from './bottomSheet.tsx';
import Lorem from './Lorem.js';

// function clamp(val, min, max) {
// return Math.min(Math.max(val, min), max);
// }

const { width, height } = Dimensions.get('screen');

interface BottomSheetMethods {
    expand: () => void;
    close: () => void;
}

export default function App() {
    const bottomSheetRef = useRef<BottomSheetMethods>(null);

    const pressHandler = useCallback(() => {
        bottomSheetRef.current?.expand();
    }, []);

    return (
        <SafeAreaProvider>
            <GestureHandlerRootView style={styles.container}>
                <BottomSheet
                    ref={bottomSheetRef}
                    snapTo={'50%'}
                    backgroundColor={'white'}
                    backDropColor={'black'}>
                    <Lorem />
                </BottomSheet>
                <Button title="ScrollView" onPress={() => pressHandler()} />
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        width: 100,
        height: 100,
        backgroundColor: '#b58df1',
        borderRadius: 20,
    },
    box2: {
        width: 240,
        height: 120,
        backgroundColor: 'pink',
        // borderTopLeftRadius: '50%',
        // borderTopRightRadius: '50%',
        // borderBottomLeftRadius: '50%',
        // borderBottomRightRadius: '50%'
        borderBottomEndRadius: '50%',
        borderBottomStartRadius: '50%',
        borderTopEndRadius: '50%',
        borderTopStartRadius: '50%'
    }
});
bottomSheet.tsx：

import { Dimensions, StyleSheet, View } from 'react-native';
import React, {
    forwardRef,
    useImperativeHandle,
    useCallback,
    useState,
} from 'react';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    useAnimatedScrollHandler,
    AnimatedScrollViewProps,
    runOnJS, useAnimatedProps,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props extends AnimatedScrollViewProps {
    snapTo: string;
    backgroundColor: string;
    backDropColor: string;
}

export interface BottomSheetMethods {
    expand: () => void;
    close: () => void;
}

const BottomSheetScrollView = forwardRef<BottomSheetMethods, Props>(
    ({ snapTo, children, backgroundColor, backDropColor, ...rest }: Props, ref) => {
        const inset = useSafeAreaInsets();
        const { height } = Dimensions.get('screen');
        const percentage = parseFloat(snapTo.replace('%', '')) / 100;
        const closeHeight = height;
        const openHeight = height - height * percentage;
        const topAnimation = useSharedValue(closeHeight);
        const context = useSharedValue(0);
        const scrollBegin = useSharedValue(0);
        const scrollY = useSharedValue(0);
        // const [enableScroll, setEnableScroll] = useState(false);
        const enableScrollShareVal = useSharedValue(false)

        const expand = useCallback(() => {
            'worklet';
            topAnimation.value = withTiming(openHeight);
        }, [openHeight, topAnimation]);

        const close = useCallback(() => {
            'worklet';
            topAnimation.value = withTiming(closeHeight);
        }, [closeHeight, topAnimation]);

        useImperativeHandle(
            ref,
            () => ({
                expand,
                close,
            }),
            [expand, close],
        );

        const animationStyle = useAnimatedStyle(() => {
            const top = topAnimation.value;
            return {
                top,
            };
        });

        const pan = Gesture.Pan()
            .onBegin(() => {
                context.value = topAnimation.value;
            })
            .onUpdate(event => {
                if (event.translationY < 0) {
                    topAnimation.value = withSpring(openHeight, {
                        damping: 100,
                        stiffness: 400,
                    });
                } else {
                    topAnimation.value = withSpring(context.value + event.translationY, {
                        damping: 100,
                        stiffness: 400,
                    });
                }
            })
            .onEnd(() => {
                if (topAnimation.value > openHeight + 50) {
                    topAnimation.value = withSpring(closeHeight, {
                        damping: 100,
                        stiffness: 400,
                    });
                } else {
                    topAnimation.value = withSpring(openHeight, {
                        damping: 100,
                        stiffness: 400,
                    });
                }
            });

        const onScroll = useAnimatedScrollHandler({
            onBeginDrag: event => {
                scrollBegin.value = event.contentOffset.y;
            },
            onScroll: event => {
                scrollY.value = event.contentOffset.y;
            },
        });

        const panScroll = Gesture.Pan()
            .onBegin(() => {
                context.value = topAnimation.value;
            })
            .onUpdate(event => {
                console.error('onUpdate, event====', event);
                if (event.translationY < 0) {
                    topAnimation.value = withSpring(openHeight, {
                        damping: 100,
                        stiffness: 400,
                    });
                } else if (event.translationY > 0 && scrollY.value === 0) {
                    // runOnJS(setEnableScroll)(false);
                    enableScrollShareVal.value = false;
                    topAnimation.value = withSpring(
                        Math.max(
                            context.value + event.translationY - scrollBegin.value,
                            openHeight,
                        ),
                        {
                            damping: 100,
                            stiffness: 400,
                        },
                    );
                }
            })
            .onEnd(() => {
                // runOnJS(setEnableScroll)(true);
                enableScrollShareVal.value = true;
                if (topAnimation.value > openHeight + 50) {
                    topAnimation.value = withSpring(closeHeight, {
                        damping: 100,
                        stiffness: 400,
                    });
                } else {
                    topAnimation.value = withSpring(openHeight, {
                        damping: 100,
                        stiffness: 400,
                    });
                }
            });

        const scrollViewGesture = Gesture.Native();

        const animatedProps = useAnimatedProps(() => {
            // console.log('enableScrollShareVal === ', enableScrollShareVal.value)
            return {
                // 动态绑定
                scrollEnabled: true // enableScrollShareVal.value
            }
        })

        return (
            <>
                <GestureDetector gesture={pan}>
                    <Animated.View
                        style={[
                            styles.container,
                            animationStyle,
                            {
                                backgroundColor: backgroundColor,
                                paddingBottom: inset.bottom,
                            },
                        ]}>
                        <View style={styles.lineContainer}>
                            <View style={styles.line} />
                        </View>
                        <GestureDetector
                            gesture={Gesture.Simultaneous(scrollViewGesture, panScroll)}>
                            <Animated.ScrollView
                                {...rest}
                                animatedProps={animatedProps}
                                bounces={false}
                                scrollEventThrottle={16}
                                onScroll={onScroll}>
                                {children}
                            </Animated.ScrollView>
                        </GestureDetector>
                    </Animated.View>
                </GestureDetector>
            </>
        );
    },
);

export default BottomSheetScrollView;

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    lineContainer: {
        marginVertical: 10,
        alignItems: 'center',
    },
    line: {
        width: 50,
        height: 4,
        backgroundColor: 'black',
        borderRadius: 20,
    },
});

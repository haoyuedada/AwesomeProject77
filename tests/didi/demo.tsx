import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS,
} from 'react-native-reanimated';
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
    ScrollView,
} from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.8;
const SCROLLVIEW_HEIGHT = 200; // ScrollView 的高度
const PAN_CONTAINER_HEIGHT = 600; // Pan 容器的高度，明显大于 ScrollView

export default function PanScrollViewDemo() {
    // 纵向 Pan 手势的偏移量
    const translateY = useSharedValue(0);
    const startY = useSharedValue(0);

    // 用于在 JS 线程打印日志的函数
    const logOnBegin = () => {
        console.log('containerPan onBegin - JS thread');
    };

    const logOnStart = () => {
        console.log('containerPan onStart - JS thread');
    };

    const logOnUpdate = (translationY: number) => {
        console.log('containerPan onUpdate - JS thread', translationY);
    };

    // 外层 Pan 手势 - 用于拖动整个容器（在 header 和 footer 区域）
    const containerPan = Gesture.Pan()
        .onStart(() => {
            runOnJS(logOnStart)();
        })
        .onBegin(() => {
            runOnJS(logOnBegin)();
            startY.value = translateY.value;
        })
        .onUpdate((event) => {
            console.log("chy jshandler onupdate")
            // 只处理垂直方向的移动
            runOnJS(logOnUpdate)(event.translationY);
            translateY.value = startY.value + event.translationY;
        });





    // 纵向 Pan 手势的动画样式
    const panAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    // 渲染横向滚动的卡片
    const renderHorizontalCard = (index: number) => (
        <View
            key={index}
            style={[
                styles.horizontalCard,
                {
                    backgroundColor: `hsl(${(index * 30) % 360}, 70%, 80%)`,
                },
            ]}>
            <Text style={styles.cardTitle}>卡片 {index + 1}</Text>
            <Text style={styles.cardText}>
                这是一个可以横向滚动的卡片
            </Text>
            <Text style={styles.cardText}>
                在纵向 Pan 手势容器内
            </Text>
        </View>
    );

    return (
        <GestureHandlerRootView style={styles.container}>
            <SafeAreaView style={styles.container}>
                {/* 新增的垂直 ScrollView - 高度 50，100 个 item */}
                <View style={styles.smallScrollViewWrapper}>
                    <ScrollView
                        style={styles.smallScrollView}
                        showsVerticalScrollIndicator={true}
                        contentContainerStyle={styles.smallScrollContent}>
                        {Array.from({ length: 100 }).map((_, index) => (
                            <View key={index} style={styles.scrollItem}>
                                <Text style={styles.scrollItemText}>Item {index + 1}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* <View style={styles.header}>
<Text style={styles.title}>Pan + ScrollView Demo</Text>
<Text style={styles.subtitle}>
纵向拖动整个卡片区域，横向滚动内部内容
</Text>
</View> */}

                {/* 纵向 Pan 手势容器 */}
                <GestureDetector 
                    gesture={containerPan}
                    >
                    <Animated.View
                        style={[
                            styles.panContainer, 
                            panAnimatedStyle
                        ]}
                        collapsable={false}>
                        <View style={styles.panHeader}>
                            <View style={styles.dragHandle} />
                            <Text style={styles.panTitle}>可纵向拖动的容器</Text>
                            <Text style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
                                触摸这里测试手势
                            </Text>
                        </View>

                        {/* 横向滚动的 ScrollView */}
                        <View style={styles.scrollViewWrapper}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={true}
                                contentContainerStyle={styles.scrollContent}
                                style={styles.scrollView}>
                                {Array.from({ length: 5 }).map((_, index) =>
                                    renderHorizontalCard(index),
                                )}
                            </ScrollView>
                        </View>

                        <View style={styles.panFooter}>
                            <Text style={styles.footerText}>
                                提示：上下拖动整个容器，左右滚动内部卡片
                            </Text>
                        </View>
                    </Animated.View>
                </GestureDetector>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    smallScrollViewWrapper: {
        height: 50,
        marginHorizontal: 16,
        marginVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 2,
    },
    smallScrollView: {
        height: 50,
    },
    smallScrollContent: {
        paddingVertical: 8,
    },
    scrollItem: {
        paddingHorizontal: 16,
        paddingVertical: 4,
        height: 34,
        justifyContent: 'center',
    },
    scrollItemText: {
        fontSize: 14,
        color: '#333',
    },
    header: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
    },
    panContainer: {
        width: SCREEN_WIDTH,
        height: PAN_CONTAINER_HEIGHT,
        backgroundColor: '#fff',
        borderRadius: 16,
        margin: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    panHeader: {
        padding: 16,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#ccc',
        borderRadius: 2,
        marginBottom: 8,
    },
    panTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    scrollViewWrapper: {
        height: SCROLLVIEW_HEIGHT - 50,
        flexShrink: 0,
    },
    scrollView: {
        height: SCROLLVIEW_HEIGHT - 50,
        flexShrink: 0,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    horizontalCard: {
        width: CARD_WIDTH,
        height: SCROLLVIEW_HEIGHT - 50,
        marginRight: 12,
        borderRadius: 12,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    cardText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 4,
    },
    panFooter: {
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    footerText: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
    },
});
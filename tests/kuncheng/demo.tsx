import React, { useCallback, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Platform } from 'react-native';
import CardView from 'react-native-cardview';
import { NavigationScreenComponent } from 'react-navigation';

// 获取屏幕宽高
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

// 暴露给外部的方法接口
export interface CardViewDataRef {
  runTestCase: (testCaseId: string) => void;
  resetToDefault: () => void;
}

// 测试用例类型 - 根据test_case.json中标记的【冒烟用例】
type TestCaseType =
// cardElevation属性测试
'cardElevation_default' // 使用默认值2，显示默认阴影大小
| 'cardElevation_valid' // 显示对应的阴影大小
// cornerRadius属性测试
| 'cornerRadius_default' // 使用默认值2，显示默认圆角大小
| 'cornerRadius_valid' // 显示对应的圆角大小
// cardMaxElevation属性测试(仅Android)
| 'cardMaxElevation_default' // CardView 的最大阴影高度为默认值 2
| 'cardMaxElevation_valid' // CardView 的最大阴影高度为指定值
// useCompatPadding属性测试(仅Android)
| 'useCompatPadding_true' // CardView 在不同系统中使用相同的 padding 值
| 'useCompatPadding_false' // CardView 在不同系统中使用不同的 padding 值
| 'useCompatPadding_default' // 默认值
// cornerOverlap属性测试(仅Android)
| 'cornerOverlap_true' // CardView 的内容避免与边角重叠
| 'cornerOverlap_false' // CardView 的内容可能与边角重叠
| 'cornerOverlap_default' // 默认值
// 属性组合测试
| 'combo_cardElevation_cornerRadius_valid' // 显示正确的阴影和圆角效果
| 'combo_cardElevation_cornerRadius_invalid' // 使用默认值，显示默认阴影和圆角效果
| 'combo_useCompatPadding_cornerOverlap_true' // 内容避免与边角重叠，且在不同系统中padding一致
| 'combo_useCompatPadding_cornerOverlap_false' // 内容可能与边角重叠，且在不同系统中padding不同
// 边界情况测试
| 'edge_empty' // CardView正常显示，无内容
| 'edge_overflow' // 内容被裁剪或显示滚动条
| 'edge_rapid_update'; // 组件正确响应最新的属性值，不出现渲染错误

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  currentTest: {
    padding: 8,
    backgroundColor: '#e3f2fd',
    marginBottom: 8
  },
  currentTestText: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  testContainer: {
    padding: 8,
    alignItems: 'center',
    height: SCREEN_HEIGHT * 0.6, // 控制测试区域的高度
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8
  },
  testSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8
  },
  selectorButton: {
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 4
  },
  selectorButtonText: {
    color: 'white',
    fontSize: 14
  },
  testInfo: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    marginBottom: 8
  },
  testInfoText: {
    fontSize: 12
  },
  errorContainer: {
    padding: 8,
    alignItems: 'center'
  },
  errorText: {
    color: 'red',
    fontSize: 14
  },
  cardContent: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardText: {
    fontSize: 16,
    color: '#333'
  },
  cardImage: {
    width: 100,
    height: 100,
    marginVertical: 10,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardImageText: {
    fontSize: 14,
    color: '#666'
  },
  overflowContent: {
    width: 300,
    height: 300,
    backgroundColor: '#f5f5f5'
  },
  updateButton: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 4
  },
  updateButtonText: {
    color: 'white',
    fontSize: 14
  },
  androidNote: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#FFF9C4',
    borderRadius: 4
  },
  androidNoteText: {
    fontSize: 12,
    color: '#FF8F00'
  },
  multipleCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  smallCard: {
    margin: 5,
    width: SCREEN_WIDTH / 2 - 20
  },
  smallCardContent: {
    padding: 10,
    alignItems: 'center'
  },
  smallCardText: {
    fontSize: 12
  }
});

// 使用 forwardRef 包装组件
const CardViewDataComponent = forwardRef<CardViewDataRef>((props, ref) => {
  const [testCase, setTestCase] = useState<TestCaseType>('cardElevation_default');
  const [currentTestIndex, setCurrentTestIndex] = useState<number>(0);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [eventData, setEventData] = useState<string>('');
  const [cardElevation, setCardElevation] = useState<number>(2);
  const [cardMaxElevation, setCardMaxElevation] = useState<number>(2);
  const [cornerRadius, setCornerRadius] = useState<number>(2);

  // 测试用例列表 - 根据test_case.json中标记的【冒烟用例】
  const testCases: TestCaseType[] = [
  // cardElevation属性测试
  'cardElevation_default',
  'cardElevation_valid',
  // cornerRadius属性测试
  'cornerRadius_default',
  'cornerRadius_valid',
  // cardMaxElevation属性测试(仅Android)
  'cardMaxElevation_default',
  'cardMaxElevation_valid',
  // useCompatPadding属性测试(仅Android)
  'useCompatPadding_true',
  'useCompatPadding_false',
  'useCompatPadding_default',
  // cornerOverlap属性测试(仅Android)
  'cornerOverlap_true',
  'cornerOverlap_false',
  'cornerOverlap_default',
  // 属性组合测试
  'combo_cardElevation_cornerRadius_valid',
  'combo_cardElevation_cornerRadius_invalid',
  'combo_useCompatPadding_cornerOverlap_true',
  'combo_useCompatPadding_cornerOverlap_false',
  // 边界情况测试
  'edge_empty',
  'edge_overflow',
  'edge_rapid_update'];


  // 运行测试用例
  const runTestCase = useCallback((testCaseId: TestCaseType) => {
    setTestCase(testCaseId);
    setRefreshKey((prev) => prev + 1);
    setEventData('');
    setCardElevation(2);
    setCornerRadius(2);

    // 找到测试用例的索引
    const index = testCases.findIndex((tc) => tc === testCaseId);
    if (index !== -1) {
      setCurrentTestIndex(index);
    }
  }, [testCases]);

  // 重置为默认状态
  const resetToDefault = useCallback(() => {
    setTestCase('cardElevation_default');
    setCurrentTestIndex(0);
    setRefreshKey((prev) => prev + 1);
    setEventData('');
    setCardElevation(2);
    setCardMaxElevation(2);
    setCornerRadius(2);
  }, []);

  // 切换到下一个测试用例
  const nextTestCase = useCallback(() => {
    const nextIndex = (currentTestIndex + 1) % testCases.length;
    setCurrentTestIndex(nextIndex);
    setTestCase(testCases[nextIndex]);
    setRefreshKey((prev) => prev + 1);
    setEventData('');
    setCardElevation(2);
    setCornerRadius(2);
  }, [currentTestIndex, testCases]);

  // 切换到上一个测试用例
  const prevTestCase = useCallback(() => {
    const prevIndex = (currentTestIndex - 1 + testCases.length) % testCases.length;
    setCurrentTestIndex(prevIndex);
    setTestCase(testCases[prevIndex]);
    setRefreshKey((prev) => prev + 1);
    setEventData('');
    setCardElevation(2);
    setCornerRadius(2);
  }, [currentTestIndex, testCases]);

  // 更新CardView属性
  const updateCardProperties = useCallback(() => {
    setCardElevation((prev) => prev + 2);
    setCardMaxElevation((prev) => prev + 2);
    setCornerRadius((prev) => prev + 2);
    setEventData(`属性已更新: cardElevation=${cardElevation + 2}, cardMaxElevation=${cardMaxElevation + 2}, cornerRadius=${cornerRadius + 2}`);
  }, [cardElevation, cardMaxElevation, cornerRadius]);

  const increaseCardElevation = useCallback(() => {
    setCardElevation((prev) => prev + 2);
  }, [cardElevation]);

  const decreaseCardElevation = useCallback(() => {
    setCardElevation((prev) => prev - 2);
  }, [cardElevation]);

  const increaseCardMaxElevation = useCallback(() => {
    setCardMaxElevation((prev) => prev + 2);
  }, [cardMaxElevation]);

  const decreaseCardMaxElevation = useCallback(() => {
    setCardMaxElevation((prev) => prev - 2);
  }, [cardMaxElevation]);

  // 使用 useImperativeHandle 暴露方法给外部
  useImperativeHandle(ref, () => ({
    runTestCase,
    resetToDefault
  }));

  // 获取当前测试用例的描述
  const getTestCaseDescription = () => {
    switch (testCase) {
      // cardElevation属性测试
      case 'cardElevation_default':
        return '不设置cardElevation - 使用默认值2，显示默认阴影大小';
      case 'cardElevation_valid':
        return '设置cardElevation为有效值 - 显示对应的阴影大小';
      // cornerRadius属性测试
      case 'cornerRadius_default':
        return '不设置cornerRadius - 使用默认值2，显示默认圆角大小';
      case 'cornerRadius_valid':
        return '设置cornerRadius为有效值 - 显示对应的圆角大小';
      // cardMaxElevation属性测试(仅Android)
      case 'cardMaxElevation_default':
        return '不设置cardMaxElevation - CardView的最大阴影高度为默认值2';
      case 'cardMaxElevation_valid':
        return '设置cardMaxElevation为有效值 - CardView的最大阴影高度为指定值';
      // useCompatPadding属性测试(仅Android)
      case 'useCompatPadding_true':
        return '设置useCompatPadding为true - CardView在不同系统中使用相同的padding值';
      case 'useCompatPadding_false':
        return '设置useCompatPadding为false - CardView在不同系统中使用不同的padding值';
      case 'useCompatPadding_default':
        return '不设置useCompatPadding - 使用默认值false';
      // cornerOverlap属性测试(仅Android)
      case 'cornerOverlap_true':
        return '设置cornerOverlap为true - CardView的内容避免与边角重叠';
      case 'cornerOverlap_false':
        return '设置cornerOverlap为false - CardView的内容可能与边角重叠';
      case 'cornerOverlap_default':
        return '不设置cornerOverlap - 使用默认值true';
      // 属性组合测试
      case 'combo_cardElevation_cornerRadius_valid':
        return '同时设置有效的cardElevation和cornerRadius - 显示正确的阴影和圆角效果';
      case 'combo_cardElevation_cornerRadius_invalid':
        return '同时设置无效的cardElevation和cornerRadius - 使用默认值，显示默认阴影和圆角效果';
      case 'combo_useCompatPadding_cornerOverlap_true':
        return '同时设置useCompatPadding和cornerOverlap为true - 内容避免与边角重叠，且在不同系统中padding一致';
      case 'combo_useCompatPadding_cornerOverlap_false':
        return '同时设置useCompatPadding和cornerOverlap为false - 内容可能与边角重叠，且在不同系统中padding不同';
      // 边界情况测试
      case 'edge_empty':
        return 'CardView内容为空 - CardView正常显示，无内容';
      case 'edge_overflow':
        return 'CardView内容超出边界 - 内容被裁剪或显示滚动条';
      case 'edge_rapid_update':
        return '快速更新多个属性 - 组件正确响应最新的属性值，不出现渲染错误';
      default:
        return '';
    }
  };

  // 获取当前测试用例的详细信息
  const getTestCaseInfo = () => {
    switch (testCase) {
      // cardElevation属性测试
      case 'cardElevation_default':
        return '测试不设置cardElevation属性时，CardView应使用默认值2，显示默认阴影大小';
      case 'cardElevation_valid':
        return '测试设置cardElevation为有效值（正数）时，CardView应显示对应大小的阴影';
      // cornerRadius属性测试
      case 'cornerRadius_default':
        return '测试不设置cornerRadius属性时，CardView应使用默认值2，显示默认圆角大小';
      case 'cornerRadius_valid':
        return '测试设置cornerRadius为有效值（正数）时，CardView应显示对应大小的圆角';
      // cardMaxElevation属性测试(仅Android)
      case 'cardMaxElevation_default':
        return '测试不设置cardMaxElevation属性时，CardView的最大阴影高度应为默认值2（仅Android）';
      case 'cardMaxElevation_valid':
        return '测试设置cardMaxElevation为有效值时，CardView的最大阴影高度应为指定值（仅Android）';
      // useCompatPadding属性测试(仅Android)
      case 'useCompatPadding_true':
        return '测试设置useCompatPadding为true时，CardView在不同系统中应使用相同的padding值（仅Android）';
      case 'useCompatPadding_false':
        return '测试设置useCompatPadding为false时，CardView在不同系统中应使用不同的padding值（仅Android）';
      case 'useCompatPadding_default':
        return '测试不设置useCompatPadding属性时，应使用默认值false（仅Android）';
      // cornerOverlap属性测试(仅Android)
      case 'cornerOverlap_true':
        return '测试设置cornerOverlap为true时，CardView的内容应避免与边角重叠（仅Android）';
      case 'cornerOverlap_false':
        return '测试设置cornerOverlap为false时，CardView的内容可能与边角重叠（仅Android）';
      case 'cornerOverlap_default':
        return '测试不设置cornerOverlap属性时，应使用默认值true（仅Android）';
      // 属性组合测试
      case 'combo_cardElevation_cornerRadius_valid':
        return '测试同时设置有效的cardElevation和cornerRadius值时，CardView应显示正确的阴影和圆角效果';
      case 'combo_cardElevation_cornerRadius_invalid':
        return '测试同时设置无效的cardElevation和cornerRadius值时，CardView应使用默认值，显示默认阴影和圆角效果';
      case 'combo_useCompatPadding_cornerOverlap_true':
        return '测试同时设置useCompatPadding和cornerOverlap为true时，CardView的内容应避免与边角重叠，且在不同系统中padding一致（仅Android）';
      case 'combo_useCompatPadding_cornerOverlap_false':
        return '测试同时设置useCompatPadding和cornerOverlap为false时，CardView的内容可能与边角重叠，且在不同系统中padding不同（仅Android）';
      // 边界情况测试
      case 'edge_empty':
        return '测试CardView内容为空时，CardView应正常显示，无内容';
      case 'edge_overflow':
        return '测试CardView内容超出边界时，内容应被裁剪或显示滚动条';
      case 'edge_rapid_update':
        return '测试快速更新多个属性时，组件应正确响应最新的属性值，不出现渲染错误';
      default:
        return '';
    }
  };

  // 渲染Android专属测试的提示
  const renderAndroidOnlyNote = () => {
    if (Platform.OS !== 'android' && (
    testCase.includes('cardMaxElevation') ||
    testCase.includes('useCompatPadding') ||
    testCase.includes('cornerOverlap'))) {
      return (
        <View style={styles.androidNote}>
          <Text style={styles.androidNoteText}>
            注意：此测试用例仅在Android平台有效。在iOS上将显示但无实际效果。
          </Text>
        </View>);

    }
    return null;
  };

  // 渲染标准卡片内容
  const renderStandardCardContent = () => {
    return (
      <View style={styles.cardContent}>
        <Text style={styles.cardText}>CardView 测试内容</Text>
        <View style={styles.cardImage}>
          <Text style={styles.cardImageText}>图片区域</Text>
        </View>
        <Text style={styles.cardText}>这是一个卡片视图组件</Text>
      </View>);

  };

  // 渲染测试用例
  const renderTestCase = () => {
    switch (testCase) {
      // cardElevation属性测试
      case 'cardElevation_default':
        return (
          <View>
            <CardView style={{ width: 250, height: 200 }}>
              {renderStandardCardContent()}
            </CardView>
            <Text style={{ marginTop: 10, textAlign: 'center' }}>
              默认cardElevation值: 2
            </Text>
          </View>);


      case 'cardElevation_valid':
        return (
          <View>
            <CardView
              style={{ width: 250, height: 200 }}
              cardElevation={5}>

              {renderStandardCardContent()}
            </CardView>
            <Text style={{ marginTop: 10, textAlign: 'center' }}>
              cardElevation值: 5
            </Text>
          </View>);


      // cornerRadius属性测试
      case 'cornerRadius_default':
        return (
          <View>
            <CardView style={{ width: 250, height: 200 }}>
              {renderStandardCardContent()}
            </CardView>
            <Text style={{ marginTop: 10, textAlign: 'center' }}>
              默认cornerRadius值: 2
            </Text>
          </View>);


      case 'cornerRadius_valid':
        return (
          <View>
            <CardView
              style={{ width: 250, height: 200 }}
              cornerRadius={10}>

              {renderStandardCardContent()}
            </CardView>
            <Text style={{ marginTop: 10, textAlign: 'center' }}>
              cornerRadius值: 10
            </Text>
          </View>);


      // cardMaxElevation属性测试(仅Android)
      case 'cardMaxElevation_default':
        return (
          <View>
            <CardView
              style={{ width: 250, height: 200 }}
              cardElevation={2}>

              {renderStandardCardContent()}
            </CardView>
            <Text style={{ marginTop: 10, textAlign: 'center' }}>
              默认cardMaxElevation值: 2
            </Text>
            {renderAndroidOnlyNote()}
          </View>);


      case 'cardMaxElevation_valid':
        return (
          <View>
            <CardView
              style={{ width: 250, height: 200 }}
              cardElevation={3}
              cardMaxElevation={6}>

              {renderStandardCardContent()}
            </CardView>
            <Text style={{ marginTop: 10, textAlign: 'center' }}>
              cardMaxElevation值: 6
            </Text>
            {renderAndroidOnlyNote()}
          </View>);


      // useCompatPadding属性测试(仅Android)
      case 'useCompatPadding_true':
        return (
          <View>
            <CardView
              style={{ width: 250, height: 200 }}
              useCompatPadding={true}>

              {renderStandardCardContent()}
            </CardView>
            <Text style={{ marginTop: 10, textAlign: 'center' }}>
              useCompatPadding值: true
            </Text>
            {renderAndroidOnlyNote()}
          </View>);


      case 'useCompatPadding_false':
        return (
          <View>
            <CardView
              style={{ width: 250, height: 200 }}
              useCompatPadding={false}>

              {renderStandardCardContent()}
            </CardView>
            <Text style={{ marginTop: 10, textAlign: 'center' }}>
              useCompatPadding值: false
            </Text>
            {renderAndroidOnlyNote()}
          </View>);


      case 'useCompatPadding_default':
        return (
          <View>
            <CardView style={{ width: 250, height: 200 }}>
              {renderStandardCardContent()}
            </CardView>
            <Text style={{ marginTop: 10, textAlign: 'center' }}>
              默认useCompatPadding值: false
            </Text>
            {renderAndroidOnlyNote()}
          </View>);


      // cornerOverlap属性测试(仅Android)
      case 'cornerOverlap_true':
        return (
          <View>
            <CardView
              style={{ width: 250, height: 200 }}
              cornerRadius={15}
              cornerOverlap={true}>

              {renderStandardCardContent()}
            </CardView>
            <Text style={{ marginTop: 10, textAlign: 'center' }}>
              cornerOverlap值: true
            </Text>
            {renderAndroidOnlyNote()}
          </View>);


      case 'cornerOverlap_false':
        return (
          <View>
            <CardView
              style={{ width: 250, height: 200 }}
              cornerRadius={15}
              cornerOverlap={false}>

              {renderStandardCardContent()}
            </CardView>
            <Text style={{ marginTop: 10, textAlign: 'center' }}>
              cornerOverlap值: false
            </Text>
            {renderAndroidOnlyNote()}
          </View>);


      case 'cornerOverlap_default':
        return (
          <View>
            <CardView
              style={{ width: 250, height: 200 }}
              cornerRadius={15}>

              {renderStandardCardContent()}
            </CardView>
            <Text style={{ marginTop: 10, textAlign: 'center' }}>
              默认cornerOverlap值: true
            </Text>
            {renderAndroidOnlyNote()}
          </View>);


      // 属性组合测试
      case 'combo_cardElevation_cornerRadius_valid':
        return (
          <View>
            <CardView
              style={{ width: 250, height: 200 }}
              // cardElevation={60}
              cardMaxElevation={80}
              cornerRadius={16}>

              {renderStandardCardContent()}
            </CardView>
            <Text style={{ marginTop: 10, textAlign: 'center' }}>
              cardElevation值: 8, cornerRadius值: 16 111111111
            </Text>
          </View>);


      case 'combo_cardElevation_cornerRadius_invalid':
        return (
          <View>
            <CardView
              style={{ width: 250, height: 200 }}
              cardElevation={-5}
              cornerRadius={-10}>

              {renderStandardCardContent()}
            </CardView>
            <Text style={{ marginTop: 10, textAlign: 'center' }}>
              无效值: cardElevation=-5, cornerRadius=-10
            </Text>
            <Text style={{ textAlign: 'center' }}>
              应使用默认值: cardElevation=2, cornerRadius=2
            </Text>
          </View>);


      case 'combo_useCompatPadding_cornerOverlap_true':
        return (
          <View>
            <CardView
              style={{ width: 250, height: 200 }}
              cornerRadius={15}
              useCompatPadding={true}
              cornerOverlap={true}>

              {renderStandardCardContent()}
            </CardView>
            <Text style={{ marginTop: 10, textAlign: 'center' }}>
              useCompatPadding=true, cornerOverlap=true
            </Text>
            {renderAndroidOnlyNote()}
          </View>);


      case 'combo_useCompatPadding_cornerOverlap_false':
        return (
          <View>
            <CardView
              style={{ width: 250, height: 200 }}
              cornerRadius={15}
              useCompatPadding={false}
              cornerOverlap={false}>

              {renderStandardCardContent()}
            </CardView>
            <Text style={{ marginTop: 10, textAlign: 'center' }}>
              useCompatPadding=false, cornerOverlap=false
            </Text>
            {renderAndroidOnlyNote()}
          </View>);


      // 边界情况测试
      case 'edge_empty':
        return (
          <View>
            <CardView
              style={{ width: 250, height: 200 }}
              cardElevation={4}
              cornerRadius={8}>

              {/* 空内容 */}
            </CardView>
            <Text style={{ marginTop: 10, textAlign: 'center' }}>
              CardView 内容为空
            </Text>
          </View>);


      case 'edge_overflow':
        return (
          <View>
            <CardView
              style={{ width: 200, height: 150 }}
              cardElevation={4}
              cornerRadius={8}>

              <ScrollView>
                <View style={styles.overflowContent}>
                  <Text style={{ padding: 10 }}>
                    这是一个内容超出CardView边界的测试。这是一个内容超出CardView边界的测试。
                    这是一个内容超出CardView边界的测试。这是一个内容超出CardView边界的测试。
                    这是一个内容超出CardView边界的测试。这是一个内容超出CardView边界的测试。
                    这是一个内容超出CardView边界的测试。这是一个内容超出CardView边界的测试。
                    这是一个内容超出CardView边界的测试。这是一个内容超出CardView边界的测试。
                  </Text>
                </View>
              </ScrollView>
            </CardView>
            <Text style={{ marginTop: 10, textAlign: 'center' }}>
              CardView 内容超出边界
            </Text>
          </View>);


      case 'edge_rapid_update':
        return (
          <View>
            <CardView
              style={{ width: 250, height: 200 }}
              cardElevation={cardElevation}
              cardMaxElevation={cardMaxElevation}
              // cornerRadius={cornerRadius}
              >

              {renderStandardCardContent()}
            </CardView>
            <Text style={{ marginTop: 10, textAlign: 'center' }}>
              当前值: cardElevation={cardElevation}, cardMaxElevation={cardMaxElevation}, cornerRadius={cornerRadius}
            </Text>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={updateCardProperties}>

              <Text style={styles.updateButtonText}>更新属性</Text>
            </TouchableOpacity>
                        <TouchableOpacity
              style={styles.updateButton}
              onPress={increaseCardMaxElevation}>

              <Text style={styles.updateButtonText}>增加MaxElevation</Text>
            </TouchableOpacity>

               <TouchableOpacity
              style={styles.updateButton}
              onPress={decreaseCardMaxElevation}>

              <Text style={styles.updateButtonText}>减小MaxElevation</Text>
            </TouchableOpacity>

               <TouchableOpacity
              style={styles.updateButton}
              onPress={increaseCardElevation}>

              <Text style={styles.updateButtonText}>增加Elevation</Text>
            </TouchableOpacity>

               <TouchableOpacity
              style={styles.updateButton}
              onPress={decreaseCardElevation}>

              <Text style={styles.updateButtonText}>减小Elevation</Text>
            </TouchableOpacity>

          </View>);


      default:
        return (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>未知测试用例</Text>
          </View>);

    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>CardView 冒烟测试</Text>
      </View>

      <View style={styles.currentTest}>
        <Text style={styles.currentTestText}>
          当前测试: {getTestCaseDescription()} ({currentTestIndex + 1}/{testCases.length})
        </Text>
      </View>

      <View style={styles.testContainer} key={refreshKey}>
        {renderTestCase()}
      </View>

      <View style={styles.testInfo}>
        <Text style={styles.testInfoText}>{getTestCaseInfo()}</Text>
        {eventData ? <Text style={styles.testInfoText}>事件数据: {eventData}</Text> : null}
      </View>

      <View style={styles.testSelector}>
        <TouchableOpacity style={styles.selectorButton} onPress={prevTestCase}>
          <Text style={styles.selectorButtonText}>上一个测试</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.selectorButton} onPress={resetToDefault}>
          <Text style={styles.selectorButtonText}>重置</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.selectorButton} onPress={nextTestCase}>
          <Text style={styles.selectorButtonText}>下一个测试</Text>
        </TouchableOpacity>
      </View>
    </View>);

});

// 导出组件并设置 navigationOptions
export const CardViewData: NavigationScreenComponent = CardViewDataComponent;

CardViewData.navigationOptions = () => {
  return {
    title: 'CardView 冒烟测试'
  };
};

export default CardViewData;
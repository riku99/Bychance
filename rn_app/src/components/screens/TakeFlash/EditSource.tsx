import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Animated,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {PanGestureHandlerGestureEvent} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import ViewShot from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';
import {RNToasty} from 'react-native-toasty';
import {
  Draw,
  DrawRef,
  SVGRenderer,
} from '@benjeau/react-native-draw/src/components';
import Svg, {Path} from 'react-native-svg';

import {SketchCanvas} from './SketchCanvas';
import {TopButtonGroup} from './TopButtonGroup';
import {ColorPicker} from './ColorPicker';
import {TextEditor, TextInfo} from './TextEditor';
import {DustIndicator} from '~/components/utils/DustIndicator';
import {AnimatedText} from './AnimatedText';
import {AnimatedSource} from './AnimatedSource';
import {PostFlashButton} from './PostButton';
import {
  setTranslateAndDiff,
  setOffsetAndDiff,
} from '~/helpers/animation/translate';
import {useCreateFlash} from '~/hooks/flashes';
import {WideRangeSourceContainer} from '~/components/utils/WideRangeSourceContainer';
import {useFlashStatusBarSetting} from '~/hooks//statusBar';

export type Source = {
  type: 'image' | 'video';
  uri: string;
};

type Props = {
  source: Source;
};

export const EditSource = React.memo(({source}: Props) => {
  const {top} = useSafeAreaInsets();
  const [sketchMode, setSketchMode] = useState(false);
  const [colorPickerMode, setColorPickerMode] = useState(false);
  const [textEditMode, setTextEditMode] = useState(false);

  const [topBackGroundColor, setTopBackGroundColor] = useState('black');
  const [bottomBackGroundColor, setBottomBackGroundColor] = useState('black');

  // テキスト関連
  // 画像のアニメーション関連のstateや関数は他のAnimatedSource以外か現時点で使われることがないのでそのコンポーネントにまとめている
  // テキスト関連のものはAnimatedText以外のコンポーネントやここのEffectでも使う必要があるので呼び出し側となるこちらで定義
  const [allTextInfo, setAllTextInfo] = useState<TextInfo[]>([]);
  const [selectedText, setSelectedText] = useState<TextInfo>();
  const textTranslate = useRef<{
    [key: string]: {x: Animated.Value; y: Animated.Value};
  }>({});
  const textOffset = useRef<{
    [key: string]: {x: number; y: number};
  }>({});
  const textPanGestureDiffX = useRef(0);
  const textPanGestureDiffY = useRef(0);

  const onTextPanGesture = useCallback(
    (e: PanGestureHandlerGestureEvent, id: number) => {
      const {x, y} = textTranslate.current[id];
      const {x: _x, y: _y} = textOffset.current[id];
      setTranslateAndDiff({
        e,
        translateX: x,
        translateY: y,
        offsetX: _x,
        offsetY: _y,
        diffX: textPanGestureDiffX,
        diffY: textPanGestureDiffY,
      });
    },
    [],
  );

  const onTextPanGestureStateChange = useCallback(
    (e: PanGestureHandlerGestureEvent, id: number) => {
      setOffsetAndDiff({
        e,
        offsetObj: textOffset.current[id],
        diffX: textPanGestureDiffX,
        diffY: textPanGestureDiffY,
      });
    },
    [],
  );

  const onTextPress = useCallback(
    ({index, id}: {index: number; id: number}) => {
      // データの取得はindexでできるが、アニメーションに関する情報との関連はidで行われているのでindex, idどちらも受け取る
      const selected = allTextInfo[index];
      const changedOffsetObj = {
        ...selected,
        // textEditorに渡すx, yの情報はその時点でのoffsetにする。textOffsetを渡して上げないと編集完了したらデフォルトのoffsetに戻ってしまう
        x: selected.x + textOffset.current[id].x,
        y: selected.y + textOffset.current[id].y,
      };
      setSelectedText(changedOffsetObj);
    },
    [allTextInfo],
  );

  useEffect(() => {
    if (selectedText) {
      setTextEditMode(true);
      const _text = allTextInfo.filter((t) => t.id !== selectedText.id);
      if (_text.length !== allTextInfo.length) {
        setAllTextInfo(_text);
        if (allTextInfo.length) {
          const num = selectedText.id;
          const {[`${num}`]: n, ...rest} = textTranslate.current; // eslint-disable-line
          const {
            [`${num}`]: selectedOffset, // eslint-disable-line
            ...restOffset
          } = textOffset.current;
          textTranslate.current = rest;
          textOffset.current = restOffset;
        } else {
          textTranslate.current = {};
        }
      }
    }
  }, [selectedText, allTextInfo]);

  useEffect(() => {
    if (textEditMode) {
      setSelectedText(undefined);
    }
  }, [textEditMode]);

  // 削除関連(テキスト関連だけれども)
  const [dustIndicator, setDustIndcator] = useState<number>();
  const onDustAnimationEnd = useCallback(
    ({id}: {id: number}) => {
      const _text = allTextInfo.filter((t) => t.id !== id);
      setAllTextInfo(_text);
      const {[String(id)]: n, ...textTranslateRest} = textTranslate.current; // eslint-disable-line
      const {[String(id)]: nn, ...textOffsetRest} = textOffset.current; // eslint-disable-line
      textTranslate.current = textTranslateRest;
      textOffset.current = textOffsetRest;
      setDustIndcator(undefined);
    },
    [allTextInfo],
  );

  const [savingData, setSavingData] = useState(false);

  // viewshot
  const create = useCreateFlash();
  const viewShotRef = useRef<ViewShot>(null);
  const onSaveBottunPress = async () => {
    //デバイスに保存する処理
    if (viewShotRef.current?.capture) {
      try {
        setSavingData(true);
        const uri = await viewShotRef.current.capture();
        await CameraRoll.save(uri);
        setSavingData(false);
        RNToasty.Show({
          title: '保存しました🤟',
          fontFamily: 'Arial',
          position: 'center',
        });
      } catch {}
    }
  };
  const onCreateBottunPress = useCallback(async () => {
    if (source.type === 'image') {
      if (viewShotRef.current && viewShotRef.current.capture) {
        const uri = await viewShotRef.current.capture();
        create({sourceType: 'image', uri});
      }
    } else {
      create({sourceType: 'video', uri: source.uri});
    }
  }, [create, source]);

  useFlashStatusBarSetting();

  return (
    <View style={styles.container}>
      <WideRangeSourceContainer>
        <ViewShot ref={viewShotRef} options={{quality: 1}}>
          <LinearGradient
            style={{height: '100%', width: '100%'}}
            colors={[topBackGroundColor, bottomBackGroundColor]}>
            <AnimatedSource source={source} />
            <View
              style={{position: 'absolute', flex: 1}}
              pointerEvents="box-none">
              {/* <Svg height={height} width={width}>
                <Path
                  key={1}
                  d="M202,329c-2,0 -3,0 -5,0v0c-2,0 -4,0 -6,0c-3,0 -5,0 -8,0c-3,0 -5,0 -8,0c-2,0 -5,0 -7,-1c-4,-2 -8,-5 -11,-8c-3,-3 -5,-7 -6,-11c-2,-4 -2,-9 -3,-14c0,-2 0,-4 0,-6c0,-3 0,-6 0,-9c0,-4 0,-8 1,-11c2,-5 6,-10 9,-15c4,-5 8,-10 13,-15c3,-3 6,-7 10,-9c3,-2 7,-2 10,-3c2,0 3,-1 5,-1c2,0 4,-1 6,0c2,1 3,3 5,4c1,1 2,2 3,3c2,3 5,5 7,8c1,2 2,3 3,5c1,2 1,3 2,5c1,3 3,5 4,8c1,2 1,4 2,6c1,2 1,4 2,6c0,2 1,3 1,5c0,2 0,4 0,6c0,2 0,4 0,6c0,1 0,3 0,4c0,2 0,4 0,6c0,1 0,3 0,4c0,1 -1,2 -2,3c-1,1 -1,3 -2,4c-1,1 -2,3 -3,4c-1,1 -2,2 -3,3c-2,1 -4,3 -6,4c-2,1 -3,3 -5,4c-1,1 -2,1 -3,2c-1,1 -2,1 -3,2c-1,1 -1,1 -2,2c0,0 -1,0 -1,0c0,0 -1,1 -1,1c0,0 0,1 0,1c0,0 -1,0 -1,0"
                  fill="none"
                  stroke="red"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg> */}
            </View>
            {sketchMode && (
              <SketchCanvas
                sketchMode={sketchMode}
                setScetchMode={setSketchMode}
              />
            )}
            {!!allTextInfo.length &&
              allTextInfo.map((data, index) => (
                <AnimatedText
                  data={data}
                  onPanGestureEvent={(e) => onTextPanGesture(e, data.id)}
                  onPanHandlerStateChange={(e) =>
                    onTextPanGestureStateChange(e, data.id)
                  }
                  translateX={textTranslate.current[data.id].x}
                  translateY={textTranslate.current[data.id].y}
                  onLongPress={() => setDustIndcator(data.id)}
                  onPressOut={() => {
                    if (dustIndicator) {
                      setDustIndcator(undefined);
                    }
                  }}
                  onPress={() => onTextPress({index, id: data.id})}
                  key={data.id}
                />
              ))}
            {colorPickerMode && (
              <ColorPicker
                setTopBackGroundColor={setTopBackGroundColor}
                setBottomBackGroundColor={setBottomBackGroundColor}
                setColorPickerMode={setColorPickerMode}
                topBackGroundColor={topBackGroundColor}
                bottomBackGroundColor={bottomBackGroundColor}
              />
            )}
            {textEditMode && (
              <>
                <View
                  style={[styles.textEditContainer, styles.textEditorOverlay]}
                />
                <View style={styles.textEditContainer}>
                  <TextEditor
                    setTextEditMode={setTextEditMode}
                    setAllTextInfo={setAllTextInfo}
                    textInfo={selectedText && selectedText}
                    textTranslate={textTranslate}
                    textOffset={textOffset}
                  />
                </View>
              </>
            )}
          </LinearGradient>
        </ViewShot>
      </WideRangeSourceContainer>

      {dustIndicator && (
        <View style={styles.dustIndicatorContainer}>
          <DustIndicator
            onAnimationEnd={() => onDustAnimationEnd({id: dustIndicator})}
          />
        </View>
      )}

      {!sketchMode && !colorPickerMode && !textEditMode && (
        <>
          <View style={[styles.buttonItemsContainer, {top: top + 10}]}>
            <TopButtonGroup
              setSketchMode={setSketchMode}
              setColorPickerMode={setColorPickerMode}
              setTextEditMode={setTextEditMode}
              onSaveButtonPress={onSaveBottunPress}
              type={source.type}
            />
          </View>
          <View style={styles.buttomButtonContainer}>
            <PostFlashButton onPress={onCreateBottunPress} />
          </View>
        </>
      )}

      {savingData && (
        <ActivityIndicator
          color="white"
          style={styles.indicator}
          size="large"
        />
      )}
      {/* <View style={{position: 'absolute', flex: 1}} pointerEvents="box-none">
        <Svg height={height} width={width}>
          <Path
            key={1}
            d="M275,515c-3,0 -5,0 -8,0v0c-3,0 -5,0 -8,0c-5,0 -10,0 -14,-2c-3,-1 -6,-4 -9,-6c-3,-2 -6,-5 -9,-8c-3,-3 -5,-6 -7,-10c-3,-5 -6,-11 -7,-17c-1,-4 0,-9 0,-13c0,-5 0,-10 0,-15c1,-7 1,-15 3,-22c3,-8 8,-15 12,-22c3,-5 6,-9 9,-13c3,-4 7,-8 11,-11c5,-4 11,-8 17,-12c3,-2 7,-4 11,-5c3,-1 7,-1 10,-2c3,-1 6,-2 9,-2c2,0 4,0 6,0c3,1 7,2 10,4c4,2 7,5 10,8c2,2 4,4 5,6c2,3 3,6 5,9c2,4 5,8 6,13c2,5 2,11 3,16c1,3 1,7 1,10c0,4 0,7 0,11c0,3 1,7 0,10c-1,5 -3,10 -5,15c-1,3 -2,7 -3,10c-1,3 -3,6 -4,9c-2,5 -3,10 -5,14c-2,4 -5,8 -8,12c-1,2 -2,4 -4,6c-2,3 -5,6 -8,8c-2,2 -5,3 -7,4c-1,1 -3,1 -4,2c-2,1 -3,2 -5,2c-1,0 -1,0 -2,0c-1,0 -1,1 -2,1c-1,0 -2,0 -3,0c-1,0 -1,0 -2,0c0,0 -1,0 -1,0c0,0 -1,-1 -1,-1v0c0,0 0,-1 0,-1v0c0,0 0,-1 0,-1c0,0 -1,0 -1,0v0"
            fill="none"
            stroke="red"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
      {sketchMode && (
        <SketchCanvas sketchMode={sketchMode} setScetchMode={setSketchMode} />
      )} */}
    </View>
  );
});

const {height, width} = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  buttonItemsContainer: {
    position: 'absolute',
    zIndex: 10,
    width: '95%',
  },
  canvas: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  textEditContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  textEditorOverlay: {
    backgroundColor: 'black',
    opacity: 0.5,
  },
  textContainer: {
    position: 'absolute',
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dustIndicatorContainer: {
    position: 'absolute',
    alignSelf: 'center',
    top: 170,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  buttomButtonContainer: {
    position: 'absolute',
    right: 30,
    bottom: '4%',
  },
});

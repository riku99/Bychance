import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Animated} from 'react-native';
import {PanGestureHandlerGestureEvent} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import ViewShot from 'react-native-view-shot';

import {SketchCanvas} from './SketchCanvas';
import {TopButtonGroup} from './TopButtonGroup';
import {ColorPicker} from './ColorPicker';
import {TextEditor, TextInfo} from './TextEditor';
import {DustIndicator} from '~/components/utils/DustIndicator';
import {AnimatedText} from './AnimatedText';
import {AnimatedImage} from './AnimatedImage';
import {PostFlashButton} from './PostButton';
import {
  setTranslateAndDiff,
  setOffsetAndDiff,
} from '~/helpers/animation/translate';
import {useCreateFlash} from '~/hooks/flashes/useCreateFlash';

export type Source = {
  type: 'image' | 'video';
  base64: string;
  uri: string;
};

type Props = {
  source: Source;
};

export const EditImage = React.memo(({source}: Props) => {
  const {top} = useSafeAreaInsets();
  const [sketchMode, setSketchMode] = useState(false);
  const [colorPickerMode, setColorPickerMode] = useState(false);
  const [textEditMode, setTextEditMode] = useState(false);

  const [topBackGroundColor, setTopBackGroundColor] = useState('black');
  const [bottomBackGroundColor, setBottomBackGroundColor] = useState('black');

  // テキスト関連
  // 画像のアニメーション関連のstateや関数は他のAnimatedImage以外か現時点で使われることがないのでそのコンポーネントにまとめている
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

  // viewshot
  const create = useCreateFlash();
  const viewShotRef = useRef<ViewShot>(null);
  const onSaveBottunPress = async () => {
    // デバイスに保存する処理
  };
  const onCreateBottunPress = useCallback(async () => {
    if (viewShotRef.current && viewShotRef.current.capture) {
      const uri = await viewShotRef.current.capture();
      create({sourceType: 'image', uri});
    }
  }, [create]);

  return (
    <View style={styles.container}>
      <ViewShot ref={viewShotRef} options={{quality: 1}}>
        <LinearGradient
          style={{height: '100%', width: '100%'}}
          colors={[topBackGroundColor, bottomBackGroundColor]}>
          <AnimatedImage source={source} />
          <SketchCanvas sketchMode={sketchMode} setScetchMode={setSketchMode} />
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
      {dustIndicator && (
        <View style={styles.dustIndicatorContainer}>
          <DustIndicator
            onAnimationEnd={() => onDustAnimationEnd({id: dustIndicator})}
          />
        </View>
      )}

      {!sketchMode && !colorPickerMode && !textEditMode && (
        <>
          <View style={[styles.buttonItemsContainer, {top}]}>
            <TopButtonGroup
              setSketchMode={setSketchMode}
              setColorPickerMode={setColorPickerMode}
              setTextEditMode={setTextEditMode}
              onSaveButtonPress={onSaveBottunPress}
            />
          </View>
          <View style={{position: 'absolute', bottom: '7%', right: 30}}>
            <PostFlashButton onPress={onCreateBottunPress} />
          </View>
        </>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

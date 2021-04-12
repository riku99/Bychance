import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Animated, Dimensions} from 'react-native';
import {
  PanGestureHandler,
  PinchGestureHandler,
  PanGestureHandlerGestureEvent,
  PinchGestureHandlerGestureEvent,
  PinchGestureHandlerStateChangeEvent,
  State,
} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import {SketchCanvas} from './SketchCanvas';
import {EditImageTopButtonItems} from './EditImageTopButtonItems';
import {ColorPicker} from './ColorPicker';
import {TextEditor, TextInfo} from './TextEditor';
import {DustIndicator} from '~/components/utils/DustIndicator';
import {AnimatedText} from './AnimatedText';
import {setTranslateAndOffset} from '~/helpers/Translation';

type Props = {
  source: {
    base64: string;
    uri: string;
  };
};

export const EditImage = ({source}: Props) => {
  const {top} = useSafeAreaInsets();
  const [sketchMode, setSketchMode] = useState(false);
  const [colorPickerMode, setColorPickerMode] = useState(false);
  const [textEditMode, setTextEditMode] = useState(false);
  // 画像関連
  const scale = useRef(new Animated.Value(1)).current;
  const totalScaleDiff = useRef(0);
  const imageScale = useRef(1);

  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const offsetX = useRef(0);
  const offsetY = useRef(0);

  const panGestureDiffY = useRef(0);
  const panGestureDiffX = useRef(0);

  const [topBackGroundColor, setTopBackGroundColor] = useState('black');
  const [bottomBackGroundColor, setBottomBackGroundColor] = useState('black');

  const onPinchGestureEvent = (e: PinchGestureHandlerGestureEvent) => {
    const _scale = e.nativeEvent.scale;
    const diff = (1 - _scale) / 3;
    totalScaleDiff.current = diff;
    const value = imageScale.current - diff;
    scale.setValue(value);
  };

  const onPinchHandlerStateChange = (
    e: PinchGestureHandlerStateChangeEvent,
  ) => {
    if (e.nativeEvent.state === State.END || State.CANCELLED) {
      imageScale.current -= totalScaleDiff.current;
      totalScaleDiff.current = 0;
    }
  };

  const onPanGesture = (e: PanGestureHandlerGestureEvent) => {
    setTranslateAndOffset({
      e,
      translateX,
      translateY,
      offsetX: offsetX.current,
      offsetY: offsetY.current,
      diffX: panGestureDiffX,
      diffY: panGestureDiffY,
    });
  };

  const onPanGestureStateChange = (e: PanGestureHandlerGestureEvent) => {
    if (e.nativeEvent.state === State.END || State.CANCELLED) {
      offsetX.current += panGestureDiffX.current;
      offsetY.current += panGestureDiffY.current;
      panGestureDiffX.current = 0;
      panGestureDiffY.current = 0;
    }
  };

  // テキスト関連
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

  const onTextPanGesture = (e: PanGestureHandlerGestureEvent, id: number) => {
    const {x, y} = textTranslate.current[id];
    const {x: _x, y: _y} = textOffset.current[id];
    setTranslateAndOffset({
      e,
      translateX: x,
      translateY: y,
      offsetX: _x,
      offsetY: _y,
      diffX: textPanGestureDiffX,
      diffY: textPanGestureDiffY,
    });
  };

  const onTextPanGestureStateChange = (
    e: PanGestureHandlerGestureEvent,
    id: number,
  ) => {
    if (e.nativeEvent.state === State.END || State.CANCELLED) {
      const targetOffset = textOffset.current[id];
      targetOffset.x += textPanGestureDiffX.current;
      targetOffset.y += textPanGestureDiffY.current;
      textPanGestureDiffX.current = 0;
      textPanGestureDiffY.current = 0;
    }
  };

  const onTextPress = ({index, id}: {index: number; id: number}) => {
    // データの取得はindexでできるが、アニメーションに関する情報との関連はidで行われているのでindex, idどちらも受け取る
    const selected = allTextInfo[index];
    const changedOffsetObj = {
      ...selected,
      // textEditorに渡すx, yの情報はその時点でのoffsetにする。textOffsetを渡して上げないと編集完了したらデフォルトのoffsetに戻ってしまう
      x: selected.x + textOffset.current[id].x,
      y: selected.y + textOffset.current[id].y,
    };
    setSelectedText(changedOffsetObj);
  };

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
  const onDustAnimationEnd = ({id}: {id: number}) => {
    const _text = allTextInfo.filter((t) => t.id !== id);
    setAllTextInfo(_text);
    const {[String(id)]: n, ...textTranslateRest} = textTranslate.current; // eslint-disable-line
    const {[String(id)]: nn, ...textOffsetRest} = textOffset.current; // eslint-disable-line
    textTranslate.current = textTranslateRest;
    textOffset.current = textOffsetRest;
    setDustIndcator(undefined);
  };

  return (
    <LinearGradient
      style={styles.container}
      colors={[topBackGroundColor, bottomBackGroundColor]}>
      {!sketchMode && !colorPickerMode && !textEditMode && (
        <View style={[styles.buttonItemsContainer, {top}]}>
          <EditImageTopButtonItems
            setSketchMode={setSketchMode}
            setColorPickerMode={setColorPickerMode}
            setTextEditMode={setTextEditMode}
          />
        </View>
      )}
      <PinchGestureHandler
        onHandlerStateChange={onPinchHandlerStateChange}
        onGestureEvent={onPinchGestureEvent}>
        <View style={[styles.pinchView]}>
          <PanGestureHandler
            onGestureEvent={onPanGesture}
            onHandlerStateChange={onPanGestureStateChange}>
            <Animated.Image
              source={{uri: source.uri}}
              style={[
                styles.photoStyle,
                {transform: [{scale}, {translateX}, {translateY}]},
              ]}
              resizeMode="contain"
            />
          </PanGestureHandler>
        </View>
      </PinchGestureHandler>
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
          <View style={[styles.textEditContainer, styles.textEditorOverlay]} />
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

      {dustIndicator && (
        <View style={styles.dustIndicatorContainer}>
          <DustIndicator
            onAnimationEnd={() => onDustAnimationEnd({id: dustIndicator})}
          />
        </View>
      )}
    </LinearGradient>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonItemsContainer: {
    position: 'absolute',
    zIndex: 10,
    width: '95%',
  },
  pinchView: {
    width,
    height: '100%',
  },
  photoStyle: {
    width,
    height: '100%',
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

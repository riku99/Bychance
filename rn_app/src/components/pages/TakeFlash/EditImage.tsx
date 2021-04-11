import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Animated, Dimensions, Text} from 'react-native';
import {
  PanGestureHandler,
  PinchGestureHandler,
  PanGestureHandlerGestureEvent,
  PinchGestureHandlerGestureEvent,
  PinchGestureHandlerStateChangeEvent,
  State,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import {SketchCanvas} from './SketchCanvas';
import {EditImageTopButtonItems} from './EditImageTopButtonItems';
import {ColorPicker} from './ColorPicker';
import {TextEditor, TextInfo} from './TextEditor';

type Props = {
  source: {
    base64: string;
    uri: string;
  };
};

export const EditImage = ({source}: Props) => {
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

  const [sketchMode, setSketchMode] = useState(false);
  const [colorPickerMode, setColorPickerMode] = useState(false);
  const [textEditMode, setTextEditMode] = useState(false);

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
    const {translationX, translationY} = e.nativeEvent;
    translateX.setValue(offsetX.current + translationX);
    translateY.setValue(offsetY.current + translationY);
    panGestureDiffX.current = translationX;
    panGestureDiffY.current = translationY;
  };

  const onTextPanGesture = (e: PanGestureHandlerGestureEvent, id: number) => {
    const {translationX, translationY} = e.nativeEvent;
    const targetTranslate = textTranslate.current[id];
    if (targetTranslate) {
      targetTranslate.x.setValue(translationX);
      targetTranslate.y.setValue(translationY);
    }
  };

  const onPanGestureStateChange = (e: PanGestureHandlerGestureEvent) => {
    if (e.nativeEvent.state === State.END || State.CANCELLED) {
      offsetX.current += panGestureDiffX.current;
      offsetY.current += panGestureDiffY.current;
      panGestureDiffX.current = 0;
      panGestureDiffY.current = 0;
    }
  };

  const {top} = useSafeAreaInsets();

  const [allTextInfo, setAllTextInfo] = useState<TextInfo[]>([]);
  const [selectedText, setSelectedText] = useState<TextInfo>();

  const textTranslate = useRef<{
    [key: string]: {x: Animated.Value; y: Animated.Value};
  }>({});

  const lastTextInfoId = useRef(0);

  // useEffect(() => {
  //   // テキストが選択したらまず何したいか
  //   // その選択した
  // }, [selectedText]);

  // useEffect(() => {
  //   if (textEditMode) {
  //     setSelectedText(undefined);
  //   }
  // }, [textEditMode]);

  // useEffect(() => {
  //   // どっちもない。つまり初回レンダリングなどで実行された場合
  //   if (!lastTextInfoId.current && !allTextInfo.length) {
  //     return;
  //   }

  //   // ① textがプレスされてselectedTextがtrueになるのでここが
  //   // if (selectedText) {
  //   //   // 編集的な意味合いにするので選択されたテキストはいったん削除する
  //   //   const _text = allTextInfo.filter((t) => t.id !== selectedText.id);
  //   //   setTextEditMode(true);
  //   //   setAllTextInfo(_text);
  //   // }

  //   // データが存在する場合
  //   if (allTextInfo.length) {
  //     console.log('データが存在する場合');
  //     const lastDataId = allTextInfo[allTextInfo.length - 1].id;
  //     // データは存在するが前回から一番新しいデータのidが増加していない。つまり追加でなはなく削除された場合
  //     // 「データが追加された場合」の処理はこのEffectではとりあえず行っていない。追加される場合の処理は再レンダリングされる前、つまりeffectより前に実行したいため。effectは再レンダリングされた後に実行される
  //     if (lastDataId <= lastTextInfoId.current && selectedText) {
  //       const num = selectedText.id;
  //       const {[`${num}`]: n, ...rest} = textTranslate.current; // eslint-disable-line
  //       textTranslate.current = rest; //
  //     }
  //     lastTextInfoId.current = lastDataId;
  //   } else {
  //     textTranslate.current = {};
  //     lastTextInfoId.current = 0;
  //   }
  // }, [allTextInfo, selectedText]);

  // const textLength = useRef(0);

  // useEffect(() => {
  //   textLength.current = allTextInfo.length;
  // }, [allTextInfo.length]);

  useEffect(() => {
    if (selectedText) {
      setTextEditMode(true);
      const _text = allTextInfo.filter((t) => t.id !== selectedText.id);
      if (_text.length !== allTextInfo.length) {
        setAllTextInfo(_text);
      }
      //lastTextInfoId.current = _text[_text.length - 1].id;
    }
  }, [selectedText, allTextInfo]);

  useEffect(() => {
    if (textEditMode) {
      setSelectedText(undefined);
    }
  }, [textEditMode]);

  const _onPress = (index: number) => {
    //const id = allTextInfo[index].id;
    setSelectedText(allTextInfo[index]);
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
          <PanGestureHandler
            onGestureEvent={(e) => onTextPanGesture(e, data.id)}>
            <Animated.View
              style={[
                styles.textContainer,
                {top: data.y, left: data.x},
                {
                  transform: [
                    {
                      translateX: textTranslate.current[data.id].x,
                    },
                    {
                      translateY: textTranslate.current[data.id].y,
                    },
                  ],
                },
              ]}
              key={data.id}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  _onPress(index);
                }}>
                <Text
                  style={[
                    styles.text,
                    {
                      fontSize: data.fontSize,
                      color: data.fontColor,
                      width: data.width,
                    },
                  ]}>
                  {data.value}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </PanGestureHandler>
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
            />
          </View>
        </>
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
});

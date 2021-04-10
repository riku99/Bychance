import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Animated, Dimensions, Text} from 'react-native';
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

  const onPanGestureStateChange = (e: PanGestureHandlerGestureEvent) => {
    if (e.nativeEvent.state === State.END || State.CANCELLED) {
      offsetX.current += panGestureDiffX.current;
      offsetY.current += panGestureDiffY.current;
      panGestureDiffX.current = 0;
      panGestureDiffY.current = 0;
    }
  };

  const {top} = useSafeAreaInsets();

  const [text, setText] = useState<TextInfo[]>([]);

  useEffect(() => {
    console.log(text);
  }, [text]);

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
      {!!text.length &&
        text.map((data, index) => (
          <View
            style={{position: 'absolute', top: data.y, left: data.x}}
            key={index}>
            <Text
              style={{
                fontSize: data.fontSize,
                color: data.fontColor,
                width: data.width,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              {data.value}
            </Text>
          </View>
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
            <TextEditor setTextEditMode={setTextEditMode} setText={setText} />
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
});

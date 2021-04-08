import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  Keyboard,
  KeyboardEvent,
  Text,
} from 'react-native';
import Slider from '@react-native-community/slider';
import {Button} from 'react-native-elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {HorizontalColorPalette} from '~/components/utils/ColorPalette';

type Props = {
  setTextEditMode: (v: boolean) => void;
};

export const TextEditor = ({setTextEditMode}: Props) => {
  const inputRef = useRef<null | TextInput>(null);

  const [text, setText] = useState('');
  const textClone = useRef('');
  const [fontSize, setFontSize] = useState(30);
  const [fontColor, setFontColor] = useState('white');

  const [maxHeight, setMaxHeight] = useState(0);

  const [onSlide, setOnSlide] = useState(false);

  const {top} = useSafeAreaInsets();
  const [topButtonHeight, setTopButtonHeight] = useState(0);

  const [strokeColorPaletteBottom, setStrokeColorPaletteBottom] = useState(0);
  const [strokeColorPaletteHeight, setStrokeColorPaletteHeight] = useState(0);

  const [keyBoardHeight, setKeyBoardHeight] = useState(0);

  const keyBoardWillShow = useCallback(
    (e: KeyboardEvent) => {
      1;
      setStrokeColorPaletteBottom(
        e.endCoordinates.height + addStrokeColorPaletteBottom,
      );
      if (!keyBoardHeight) {
        setKeyBoardHeight(e.endCoordinates.height);
      }
    },
    [keyBoardHeight],
  );

  useLayoutEffect(() => {
    Keyboard.addListener('keyboardWillShow', keyBoardWillShow);

    return () => Keyboard.removeListener('keyboardWillShow', keyBoardWillShow);
  }, [keyBoardWillShow]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const onSelectColor = (color: string) => {
    setText((t) => t + ' ');
    setTimeout(() => {
      setFontColor(color);
      setText(textClone.current);
    }, 1);
  };

  const [textAreaTop, setTextAreaTop] = useState(0);

  useEffect(() => {
    setTextAreaTop(topButtonHeight + top);
  }, [topButtonHeight, top]);

  useEffect(() => {
    setMaxHeight(
      height -
        (top +
          topButtonHeight +
          +keyBoardHeight +
          strokeColorPaletteHeight +
          addStrokeColorPaletteBottom),
    );
  }, [top, topButtonHeight, keyBoardHeight, strokeColorPaletteHeight]);

  // TextInputのfontSizeとかスタイルに関するプロパティがローマ字以外だと動的に設定できないというバグがある
  // issue見ても解決されていないっぽいので、それらに対応するためにややこしめなことしている
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.textArea,
          {
            top: textAreaTop,
            width,
            height: maxHeight,
          },
        ]}>
        <TextInput
          ref={inputRef}
          multiline={true}
          style={[
            styles.input,
            {
              fontSize,
              maxHeight: !onSlide ? maxHeight : 0,
              color: !onSlide ? fontColor : 'transparent',
            },
          ]}
          value={text}
          selectionColor={!onSlide ? undefined : 'transparent'}
          keyboardAppearance="dark"
          onChangeText={(t) => {
            setText(t);
            textClone.current = t;
          }}
        />

        {onSlide && (
          <Text
            style={[
              styles.input,
              styles.slideText,
              {
                fontSize,
                maxHeight,
                color: fontColor,
              },
            ]}>
            {text}
          </Text>
        )}
      </View>

      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          value={35}
          minimumValue={10}
          maximumValue={50}
          maximumTrackTintColor="#FFFFFF"
          onSlidingStart={() => {
            setText((t) => t + ' ');
            setTimeout(() => {
              setOnSlide(true);
              setText(textClone.current);
            }, 1);
          }}
          onValueChange={(v) => {
            setFontSize(v);
          }}
          onSlidingComplete={(v) => {
            setText((t) => t + ' ');
            setTimeout(() => {
              setFontSize(v);
              setText(textClone.current);
            }, 1);
            setOnSlide(false);
          }}
        />
      </View>
      <View
        style={[
          styles.strokeColorPalette,
          {
            bottom: strokeColorPaletteBottom,
          },
        ]}
        onLayout={(e) =>
          setStrokeColorPaletteHeight(e.nativeEvent.layout.height)
        }>
        <HorizontalColorPalette onSelect={onSelectColor} />
      </View>
      <View
        style={[styles.topButtonContaienr, {top}]}
        onLayout={(e) => setTopButtonHeight(e.nativeEvent.layout.height)}>
        <Button
          title="完了"
          titleStyle={{fontSize: 22, fontWeight: '500'}}
          buttonStyle={{backgroundColor: 'transparent'}}
          style={{alignSelf: 'flex-end'}}
          onPress={() => setTextEditMode(false)}
        />
      </View>
    </View>
  );
};

const {width, height} = Dimensions.get('window');

const addStrokeColorPaletteBottom = 10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  textArea: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    maxWidth: width,
    borderColor: 'transparent',
    borderWidth: 1,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sliderContainer: {
    transform: [{rotate: '-90deg'}],
    position: 'absolute',
    top: '40%',
    left: -70,
  },
  slider: {
    width: 200,
    height: 20,
  },
  topButtonContaienr: {
    position: 'absolute',
    width: '95%',
  },
  slideText: {
    color: 'white',
  },
  strokeColorPalette: {
    width: '92%',
    position: 'absolute',
  },
});

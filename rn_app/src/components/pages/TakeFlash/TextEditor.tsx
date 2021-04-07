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
  LayoutChangeEvent,
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

  const defaultMarginTop = useRef<null | number>(null);
  const [inputMarginTop, setInputMarginTop] = useState(0);

  const [inputHeight, setInputHeight] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);

  const [onSlide, setOnSlide] = useState(false);

  const keyBoardWillShow = useCallback(
    (e: KeyboardEvent) => {
      const top = (height - e.endCoordinates.height) / 2;
      if (!maxHeight) {
        setMaxHeight(height - (100 + e.endCoordinates.height));
      }
      if (!inputMarginTop) {
        setInputMarginTop(top);
      }
      if (!defaultMarginTop.current) {
        defaultMarginTop.current = top;
      }
    },
    [inputMarginTop, maxHeight],
  );

  useLayoutEffect(() => {
    Keyboard.addListener('keyboardWillShow', keyBoardWillShow);

    return () => Keyboard.removeListener('keyboardWillShow', keyBoardWillShow);
  }, [inputMarginTop, keyBoardWillShow]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const onLayout = (e: LayoutChangeEvent) => {
    const {height} = e.nativeEvent.layout;
    // 文字入力でheightは変化してないのに発火してしまうことがあるので、変化してない場合は処理を行わない
    if (height === inputHeight) {
      return;
    }
    const diff = Math.abs(height - inputHeight);
    // diffがfontSizeよりでかい、つまり行数が変化したかどうかを条件にして分岐。これないとfontSizeの変化のたび常に新しいmtが設定されてしまう。
    if (diff > fontSize) {
      if (height > inputHeight) {
        // heightが高くなった = margontopが少なくなる。 どれくらい少なくなるかというと、増加したheight分
        const nextMarginTop = inputMarginTop - diff; // 変化するmarigの値
        // 変化の結果が safeAreaのtop + 上部にあるボタン群 の高さ以下にならない場合のみmarginTopの値を更新。100はとりあえずの値。あとで変える。
        if (nextMarginTop >= 100) {
          setInputMarginTop(nextMarginTop);
        }
      } else {
        const nextMarginTop = inputMarginTop + diff;
        // marginTopが最初の位置よりは下にならないようにする
        if (nextMarginTop <= defaultMarginTop.current!) {
          setInputMarginTop(nextMarginTop);
        }
      }
    }
    setInputHeight(height);
  };

  const {top} = useSafeAreaInsets();

  // TextInputのfontSizeとかスタイルに関するプロパティがローマ字以外だと動的に設定できないというバグがある
  // issue見ても解決されていないっぽいので、それらに対応するためにややこしめなことしている
  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        multiline={true}
        style={[
          styles.input,
          {
            position: 'absolute',
            top: inputMarginTop,
            maxHeight,
            fontSize,
            color: !onSlide ? fontColor : 'transparent',
          },
        ]}
        value={text}
        selectionColor={!onSlide ? undefined : 'transparent'}
        onLayout={(e) => onLayout(e)}
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
              top: inputMarginTop,
              maxHeight,
              fontSize,
              color: fontColor,
            },
          ]}>
          {text}
        </Text>
      )}

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
      <View style={{width: '92%', position: 'absolute', top: 500}}>
        <HorizontalColorPalette onSelect={(color) => setFontColor(color)} />
      </View>
      <View style={[styles.topButtonContaienr, {top}]}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
    position: 'absolute',
    color: 'white',
  },
});

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

export type TextInfo = {
  x: number;
  y: number;
  width: number;
  fontSize: number;
  value: string;
  fontColor: string;
};

type Props = {
  setTextEditMode: (v: boolean) => void;
  setTextInfo: React.Dispatch<React.SetStateAction<TextInfo[]>>;
  textInfo?: TextInfo;
};

export const TextEditor = ({setTextEditMode, setTextInfo}: Props) => {
  const inputRef = useRef<null | TextInput>(null);

  const [value, setValue] = useState('');
  const valueClone = useRef('');

  const [fontSize, setFontSize] = useState(defaultFontSize);
  const [fontColor, setFontColor] = useState('white');

  const [textAreaTop, setValueAreaTop] = useState(0);
  const [offset, setOffset] = useState<{x: number; y: number} | null>(null);
  const [textAreaWidth, setTextAreaWidth] = useState(0);

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

  useEffect(() => {
    setValueAreaTop(topButtonHeight + top);
  }, [topButtonHeight, top]);

  useEffect(() => {
    setMaxHeight(
      height -
        (top +
          topButtonHeight +
          keyBoardHeight +
          strokeColorPaletteHeight +
          addStrokeColorPaletteBottom),
    );
  }, [top, topButtonHeight, keyBoardHeight, strokeColorPaletteHeight]);

  const onSelectColor = (color: string) => {
    setValue((t) => t + ' ');
    setTimeout(() => {
      setFontColor(color);
      setValue(valueClone.current);
    }, 1);
  };

  const onSlidingStart = () => {
    setValue((t) => t + ' ');
    setTimeout(() => {
      setOnSlide(true);
      setValue(valueClone.current);
    }, 1);
  };

  const onSlidingComplete = async (v: number) => {
    // useStateのセッターは内部的には非同期で値が更新される
    // なので直後にstateを使ってもイベントループの性質上基本的にまだ変更が反映されていない
    // そのため直後にsetValue(valueClone.current)を実行すると前回のものと同じなので、再レンダリングされない
    // setTimeoutで非同期にしてあげることで、キューに渡された順番的に最初にstateの更新作業が行われる
    // その後にsetValue(valueClone.current)を行うことで再レンダリングを起こしている
    setValue((t) => t + ' ');
    setTimeout(() => {
      setFontSize(v);
      setValue(valueClone.current);
    }, 1);
    setOnSlide(false);
  };

  const onTextAreaLayout = (e: LayoutChangeEvent) => {
    const {x, y, width} = e.nativeEvent.layout;
    setOffset({x, y});
    setTextAreaWidth(width);
  };

  const onChangeText = (t: string) => {
    setValue(t);
    valueClone.current = t;
  };

  const onCompleteButtonPress = () => {
    if (offset && value) {
      setTextInfo((t) => [
        ...t,
        {
          x: offset.x,
          y: offset.y + textAreaTop,
          fontSize,
          value,
          fontColor,
          width: textAreaWidth,
        },
      ]);
    }
    setTextEditMode(false);
  };

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
              // sliderでフォントサイズを変更する際、TextInputがあるとslider動かしている時に表示されるTextの表示位置がずれてしまうのでheightを0にする
              // 演算子でTextInputそのものを消すと、それまでの情報も消えてしまうのでheight: 0で対応
              maxHeight: !onSlide ? maxHeight : 0,
              color: !onSlide ? fontColor : 'transparent',
            },
          ]}
          value={value}
          selectionColor={!onSlide ? undefined : 'transparent'}
          keyboardAppearance="dark"
          scrollEnabled={false}
          onLayout={onTextAreaLayout}
          onChangeText={onChangeText}
        />

        {/* TextInputのスタイルがローマ字以外だと反映されないので、fontSizeの変更はTextで対応 */}
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
            {value}
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
          onSlidingStart={onSlidingStart}
          onValueChange={(v) => {
            setFontSize(v);
          }}
          onSlidingComplete={(v) => onSlidingComplete(v)}
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
          onPress={onCompleteButtonPress}
        />
      </View>
    </View>
  );
};

const {width, height} = Dimensions.get('window');

const addStrokeColorPaletteBottom = 10;

const defaultFontSize = 30;

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

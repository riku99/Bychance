import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  Text,
  LayoutChangeEvent,
  Animated,
} from 'react-native';
import Slider from '@react-native-community/slider';
import {Button} from 'react-native-elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {HorizontalColorPalette} from '~/components/utils/ColorPalette';
import {TouchableOpacity} from 'react-native-gesture-handler';

export type TextInfo = {
  id: number;
  x: number;
  y: number;
  width: number;
  fontSize: number;
  value: string;
  fontColor: string;
};

type Props = {
  setTextEditMode: (v: boolean) => void;
  setAllTextInfo: React.Dispatch<React.SetStateAction<TextInfo[]>>;
  textInfo?: TextInfo;
  textTranslate: React.MutableRefObject<{
    [key: string]: {
      x: Animated.Value;
      y: Animated.Value;
    };
  }>;
  textOffset: React.MutableRefObject<{
    [key: string]: {
      x: number;
      y: number;
    };
  }>;
};

export const TextEditor = ({
  setTextEditMode,
  setAllTextInfo,
  textInfo,
  textTranslate,
  textOffset,
}: Props) => {
  const inputRef = useRef<null | TextInput>(null);
  const {top} = useSafeAreaInsets();

  const [value, setValue] = useState(textInfo ? textInfo.value : '');
  const valueClone = useRef(textInfo ? textInfo.value : '');

  const [fontSize, setFontSize] = useState(
    textInfo ? textInfo.fontSize : defaultFontSize,
  );
  // 初回のfontSizeだけとりたい
  const firstFontSize = useMemo(() => fontSize, []); // eslint-disable-line
  const [fontColor, setFontColor] = useState(
    textInfo ? textInfo.fontColor : defaultFontColor,
  );

  const textAreaTop = useMemo(() => completeButtonHeight + top, [top]);
  const [offset, setOffset] = useState<{x: number; y: number} | null>(null);
  const [textAreaWidth, setTextAreaWidth] = useState(0);

  const [onSlide, setOnSlide] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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

  const off = useMemo(() => textInfo && {x: textInfo.x, y: textInfo.y}, []);

  const onCompleteButtonPress = () => {
    if (offset && value) {
      setAllTextInfo((t) => {
        let id: number;
        if (t.length) {
          id = t[t.length - 1].id + 1;
        } else {
          id = 1;
        }
        // 要素のレンダリングの関係でtextInfoの変化で再レンダリングが起きる前にtextTranslate.currentにデータを入れたい。
        // データにはtextInfoのidが必要なのでここでcurrentにデータを入れている
        textTranslate.current[String(id)] = {
          x: new Animated.Value(0),
          y: new Animated.Value(0),
        };
        textOffset.current[String(id)] = {
          x: 0,
          y: 0,
        };
        console.log(off);
        return [
          ...t,
          {
            id,
            x: off ? off.x : offset.x,
            y: off ? off.y : offset.y + textAreaTop,
            fontSize,
            value,
            fontColor,
            width: textAreaWidth,
          },
        ];
      });
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
          },
        ]}>
        <TouchableOpacity
          style={[styles.textAreaTouchEnabled, {height: !onSlide ? '100%' : 0}]}
          activeOpacity={1}
          onPress={onCompleteButtonPress}>
          <TextInput
            ref={inputRef}
            multiline={true}
            style={[
              styles.input,
              {
                fontSize,
                // sliderでフォントサイズを変更する際、TextInputがあるとslider動かしている時に表示されるTextの表示位置がずれてしまうのでheightを0にする
                // 演算子でTextInputそのものを消すと、それまでの情報も消えてしまうのでheight: 0で対応
                maxHeight: !onSlide ? '100%' : 0,
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
        </TouchableOpacity>

        {/* TextInputのスタイルがローマ字以外だと反映されないので、fontSizeの変更はTextで対応 */}
        {onSlide && (
          <Text
            style={[
              styles.input,
              styles.slideText,
              {
                fontSize,
                color: fontColor,
              },
            ]}>
            {value}
          </Text>
        )}
      </View>

      <View style={[styles.sliderContainer]}>
        <Slider
          style={styles.slider}
          value={firstFontSize}
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
            bottom: addStrokeColorPaletteBottom,
          },
        ]}>
        <HorizontalColorPalette onSelect={onSelectColor} />
      </View>
      <View
        style={[
          styles.topButtonContaienr,
          {top, height: completeButtonHeight},
        ]}>
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

const {width} = Dimensions.get('window');

const addStrokeColorPaletteBottom = '40%';

const defaultFontSize = 30;

const defaultFontColor = '#FFFFFF';

const completeButtonHeight = 40;

const textAreaHeight = '46%';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  textArea: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    height: textAreaHeight,
  },
  textAreaTouchEnabled: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
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
    top: '30%',
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
    maxHeight: '100%',
  },
  strokeColorPalette: {
    width: '92%',
    position: 'absolute',
  },
});

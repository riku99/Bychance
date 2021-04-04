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
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
} from 'react-native';

export const TextEditor = () => {
  const inputRef = useRef<null | TextInput>(null);

  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(35);

  const defaultMarginTop = useRef<null | number>(null);
  const [inputMarginTop, setInputMarginTop] = useState(0);

  const [inputHeight, setInputHeight] = useState(0);

  const keyBoardWillShow = useCallback(
    (e: KeyboardEvent) => {
      const top = (height - e.endCoordinates.height) / 2;
      if (!inputMarginTop) {
        setInputMarginTop(top);
      }
      if (!defaultMarginTop.current) {
        defaultMarginTop.current = top;
      }
    },
    [inputMarginTop],
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

  const onContentSizeChange = (
    e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
  ) => {
    setInputHeight(e.nativeEvent.contentSize.height);
    if (e.nativeEvent.contentSize.height > inputHeight) {
      // heightが高くなった = margontopが少なくなる。 どれくらい少なくなるかというと、増加したheight分
      const diff = e.nativeEvent.contentSize.height - inputHeight; // heightの増加分
      const nextMarginTop = inputMarginTop - diff; // 変化するmarigの値
      // 変化の結果が safeAreaのtop + 上部にあるボタン群 の高さ以下にならない場合のみmarginTopの値を更新。100はとりあえずの値。あとで変える。
      if (nextMarginTop >= 100) {
        setInputMarginTop(nextMarginTop);
      }
    } else {
      const diff = inputHeight - e.nativeEvent.contentSize.height;
      const nextMarginTop = inputMarginTop + diff;
      // marginTopが最初の位置よりは下にならないようにする
      if (nextMarginTop <= defaultMarginTop.current!) {
        setInputMarginTop(nextMarginTop);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        multiline={true}
        style={[
          styles.input,
          {
            fontSize,
            marginTop: inputMarginTop,
          },
        ]}
        onContentSizeChange={(e) => onContentSizeChange(e)}
        onChangeText={(t) => setText(t)}
        value={text}
      />
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
    borderColor: 'red',
    //borderColor: 'transparent',
    borderWidth: 1,
    color: 'white',
    fontWeight: 'bold',
    alignItems: 'center',
    textAlign: 'center',
  },
});

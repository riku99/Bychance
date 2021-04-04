import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  Keyboard,
  KeyboardEvent,
} from 'react-native';

export const TextEditor = () => {
  const inputRef = useRef<null | TextInput>(null);

  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(35);

  const defaultMarginTop = useRef<null | number>(null);
  const [inputMarginTop, setInputMarginTop] = useState(0);

  const [inputHeight, setInputHeight] = useState(0);

  const keyBoardWillShow = (e: KeyboardEvent) => {
    const top = (height - e.endCoordinates.height) / 2;
    setInputMarginTop(top);
    if (!defaultMarginTop.current) {
      defaultMarginTop.current = top;
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useLayoutEffect(() => {
    Keyboard.addListener('keyboardWillShow', keyBoardWillShow);

    return () => Keyboard.removeListener('keyboardWillShow', keyBoardWillShow);
  }, [inputMarginTop]);

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
        onContentSizeChange={(e) => {
          console.log(e.nativeEvent.contentSize);
          setInputHeight(e.nativeEvent.contentSize.height);
          if (e.nativeEvent.contentSize.height > inputHeight) {
            // heightが高くなった = margontopが少なくなる
            // どれくらい少なくなるかというと、増加したheight分
            // 増加したheightをどうやってとるか。contentsize.height - inputheight
            const diff = e.nativeEvent.contentSize.height - inputHeight;
            const nextMarginTop = inputMarginTop - diff;
            if (nextMarginTop >= 100) {
              // 100はとりあえずの仮定
              setInputMarginTop(nextMarginTop);
            }
          } else {
            // heigtが低くなった。= marginTopが増える
            // どれくらい? 減少したheight分
            // 減少分をどうやってとるか inputHeight - contentSize.height
            const diff = inputHeight - e.nativeEvent.contentSize.height;
            const nextMarginTop = inputMarginTop + diff;
            if (nextMarginTop <= defaultMarginTop.current!) {
              setInputMarginTop(nextMarginTop);
            }
          }
        }}
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
    //backgroundColor: 'black',
    //opacity: 0.4,
    alignItems: 'center',
  },
  input: {
    maxWidth: width,
    borderColor: 'transparent',
    borderWidth: 1,
    color: 'white',
    fontWeight: 'bold',
    alignItems: 'center',
  },
});

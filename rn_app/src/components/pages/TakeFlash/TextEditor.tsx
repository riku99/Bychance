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
  const [inputMarginTop, setInputMarginTop] = useState(0);
  const [fontSize, setFontSize] = useState(35);
  const [inputHeight, setInputHeight] = useState(35);
  const [text, setText] = useState('');

  const keyBoardDidShow = (e: KeyboardEvent) =>
    setInputMarginTop((height - e.endCoordinates.height) / 2);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useLayoutEffect(() => {
    Keyboard.addListener('keyboardWillShow', keyBoardDidShow);

    return () => Keyboard.removeListener('keyboardWillShow', keyBoardDidShow);
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
            height: Math.max(fontSize, inputHeight),
          },
        ]}
        onContentSizeChange={(e) => {
          console.log(e);
          setInputHeight(e.nativeEvent.contentSize.height);
          if (e.nativeEvent.contentSize.height > inputHeight) {
            // heightが高くなった = margontopが少なくなる
            // どれくらい少なくなるかというと、増加したheight分
            // 増加したheightをどうやってとるか。contentsize.height - inputheight
            const diff = e.nativeEvent.contentSize.height - inputHeight;
            setInputMarginTop((current) => current - diff);
          } else {
            // heigtが低くなった。= marginTopが増える
            // どれくらい? 減少したheight分
            // 減少分をどうやってとるか inputHeight - contentSize.height
            const diff = inputHeight - e.nativeEvent.contentSize.height;
            setInputMarginTop((current) => current + diff);
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
    borderColor: 'gray',
    borderWidth: 1,
    color: 'white',
    fontWeight: 'bold',
    alignItems: 'center',
  },
});

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
  const defaultMarginTop = useRef<null | number>(null);
  const defaultInputHeight = useRef<number>(0);
  const [inputMarginTop, setInputMarginTop] = useState(0);
  const [fontSize, setFontSize] = useState(35);
  const [inputHeight, setInputHeight] = useState(35);
  const [text, setText] = useState('');

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

  console.log(`最新のmarginTopは${inputMarginTop}です`);

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
            height: Math.max(defaultInputHeight.current, inputHeight),
          },
        ]}
        onContentSizeChange={(e) => {
          console.log(
            `コンテンツのサイズが${e.nativeEvent.contentSize.height}になりました`,
          );
          if (e.nativeEvent.contentSize.height !== inputHeight) {
            console.log('高さが変化したので更新します');
            setInputHeight(e.nativeEvent.contentSize.height);
          }
          if (e.nativeEvent.contentSize.height > inputHeight) {
            console.log('それまでのinputHeightより高くなりました');
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
        onLayout={(e) => {
          if (!defaultInputHeight.current) {
            console.log(
              `デフォルトの高さを${e.nativeEvent.layout.height}で設定します`,
            );
            defaultInputHeight.current = e.nativeEvent.layout.height;
          }
        }}
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

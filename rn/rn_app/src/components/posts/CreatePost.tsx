import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, ActivityIndicator} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {TextInput} from 'react-native-gesture-handler';
import {Button} from 'react-native-elements';

type Props = {
  selectedImage: string | undefined;
  createPost: ({text, image}: {text: string; image: string}) => Promise<void>;
};

export const CreatePost = ({createPost, selectedImage}: Props) => {
  const [text, setText] = useState('');
  const [postProcess, setPostProcess] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      setText('');
      setPostProcess(false);
    }
  }, [isFocused]);

  return (
    <>
      {selectedImage ? (
        <View style={styles.container}>
          {selectedImage ? (
            <Image source={{uri: selectedImage}} style={styles.image} />
          ) : (
            <View style={{...styles.image, justifyContent: 'center'}}>
              <ActivityIndicator size="small" />
            </View>
          )}
          <TextInput
            style={styles.textArea}
            multiline={true}
            placeholder="テキストの入力"
            onChangeText={(t) => {
              setText(t);
            }}>
            {text}
          </TextInput>
          {postProcess ? (
            <ActivityIndicator style={styles.postButton} />
          ) : (
            <Button
              title={'投稿する'}
              buttonStyle={styles.postButton}
              titleStyle={styles.postButtonTitle}
              onPress={() => {
                setPostProcess(true);
                createPost({text: text, image: selectedImage!});
              }}
            />
          )}
        </View>
      ) : (
        <View style={{...styles.container, justifyContent: 'center'}}>
          <ActivityIndicator />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    height: 70,
    width: 70,
    marginTop: 30,
  },
  textArea: {
    width: '85%',
    marginTop: 30,
    borderBottomColor: '#c9c9c9',
    borderBottomWidth: 0.5,
    fontSize: 17,
  },
  postButton: {
    marginTop: 40,
    fontSize: 17,
    backgroundColor: 'transparent',
  },
  postButtonTitle: {color: '#4fa9ff', fontWeight: 'bold'},
});

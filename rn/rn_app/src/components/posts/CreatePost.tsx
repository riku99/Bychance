import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, ActivityIndicator} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import ImagePicker from 'react-native-image-picker';
import {TextInput} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native-elements';

type Props = {
  createPost: ({text, image}: {text: string; image: string}) => void;
  setProcess: () => void;
};

export const Post = ({createPost, setProcess}: Props) => {
  const isFocused = useIsFocused();
  const [selectedImage, setSelectedImage] = useState<undefined | string>(
    undefined,
  );
  const [text, setText] = useState('');
  const [page, setPage] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (isFocused) {
      ImagePicker.launchImageLibrary({quality: 0.5}, (response) => {
        if (response.didCancel) {
          navigation.goBack();
        }
        let img;
        if ((img = response.data)) {
          setPage(true);
          const source = 'data:image/jpeg;base64,' + img;
          setSelectedImage(source);
        }
      });
    } else {
      setText('');
      setPage(false);
      setSelectedImage(undefined);
    }
  }, [isFocused, navigation]);

  return (
    <>
      {page ? (
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
          <Button
            title={'投稿する'}
            buttonStyle={styles.postButton}
            titleStyle={styles.postButtonTitle}
            onPress={() => {
              setProcess();
              navigation.goBack();
              createPost({text: text, image: selectedImage!});
            }}
          />
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

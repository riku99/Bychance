import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import ImagePicker from 'react-native-image-picker';
import {TextInput} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native-elements';

type Props = {
  redirect?: boolean;
  createPost: ({text, image}: {text: string; image: string}) => void;
  falseRedirect: () => void;
};

export const Post = ({createPost, redirect, falseRedirect}: Props) => {
  const isFocused = useIsFocused();
  const [selectedImage, setSelectedImage] = useState<undefined | string>(
    undefined,
  );
  const [text, setText] = useState('');
  const [loading, setLoding] = useState(false);
  const [page, setPage] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    if (isFocused) {
      setTimeout(() => {
        setPage(true);
      }, 1000);
      ImagePicker.launchImageLibrary({}, (response) => {
        if (response.didCancel) {
          navigation.goBack();
        }
        if (response.uri) {
          const source = 'data:image/jpeg;base64,' + response.data;
          setSelectedImage(source);
        }
      });
    } else {
      setText('');
      setPage(false);
      setSelectedImage(undefined);
      setLoding(false);
    }
  }, [isFocused, navigation]);

  useEffect(() => {
    if (redirect) {
      navigation.goBack();
      falseRedirect();
    }
  }, [redirect, falseRedirect, navigation]);

  if (!page) {
    return null;
  }

  return (
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
      {loading ? (
        <Button
          loading
          loadingProps={{color: '#5c94c8'}}
          buttonStyle={styles.postButton}
        />
      ) : (
        <Button
          title={'投稿する'}
          buttonStyle={styles.postButton}
          titleStyle={styles.postButtonTitle}
          onPress={() => {
            setLoding(true);
            createPost({text: text, image: selectedImage!});
          }}
        />
      )}
    </View>
  );
};

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    height: width / 3,
    width: width / 3,
    marginTop: 30,
  },
  textArea: {
    height: 120,
    width: '100%',
    marginTop: 30,
    borderColor: '#c9c9c9',
    borderWidth: 0.5,
    fontSize: 17,
  },
  postButton: {
    marginTop: 40,
    fontSize: 17,
    backgroundColor: 'transparent',
  },
  postButtonTitle: {color: '#4fa9ff', fontWeight: 'bold'},
});

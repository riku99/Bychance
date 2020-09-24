import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import ImagePicker from 'react-native-image-picker';
import {TextInput} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

export const Post = () => {
  const isFocused = useIsFocused();
  const [selectedImage, setSelectedImage] = useState<undefined | string>(
    undefined,
  );
  const [text, setText] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    if (isFocused) {
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
      setSelectedImage(undefined);
    }
  }, [isFocused, navigation]);

  if (!selectedImage) {
    return (
      <View style={{...styles.container, justifyContent: 'center'}}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{uri: selectedImage}} style={styles.image} />
      <TextInput
        style={styles.textArea}
        multiline={true}
        placeholder="テキストの入力"
        onChangeText={(t) => {
          setText(t);
        }}>
        {null}
      </TextInput>
      <Text
        style={styles.postButton}
        onPress={() => {
          console.log(text);
        }}>
        投稿する
      </Text>
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
    color: '#4fa9ff',
    fontWeight: 'bold',
    fontSize: 17,
  },
});

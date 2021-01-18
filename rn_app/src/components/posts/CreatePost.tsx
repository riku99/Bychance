import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useIsFocused, NavigationProp} from '@react-navigation/native';
import {TextInput} from 'react-native-gesture-handler';
import {Button} from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';

import {AppDispatch} from '../../redux';
import {creatingPost} from '../../redux/otherSettings';
import {PostStackParamList} from '../../screens/Post';
import {createPostAction} from '../../actions/posts';

type CreatePostNavigationProp = NavigationProp<
  PostStackParamList,
  'CreatePostTable'
>;

type Props = {
  navigation: CreatePostNavigationProp;
};

export const CreatePost = ({navigation}: Props) => {
  const isFocused = useIsFocused();

  const [selectedImage, setSelectedImage] = useState<undefined | string>();
  const [text, setText] = useState('');

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const createPost = async (data: {text: string; image: string}) => {
      dispatch(creatingPost());
      navigation.goBack();
      await dispatch(createPostAction(data));
      dispatch(creatingPost());
    };

    navigation.setOptions({
      headerRight: selectedImage
        ? () => (
            <Button
              title="投稿"
              buttonStyle={{backgroundColor: 'transparent'}}
              titleStyle={{color: '#5c94c8', fontWeight: 'bold'}}
              onPress={() => createPost({text, image: selectedImage})}
            />
          )
        : undefined,
    });
  }, [navigation, selectedImage, text, dispatch]);

  useEffect(() => {
    if (isFocused) {
      ImagePicker.launchImageLibrary({quality: 1}, (response) => {
        if (response.didCancel) {
          navigation.goBack();
        }
        let img;
        if ((img = response.data)) {
          const source = 'data:image/jpeg;base64,' + img;
          setSelectedImage(source);
        }
      });
    } else {
      setSelectedImage(undefined);
    }
  }, [isFocused, navigation]);

  useEffect(() => {
    if (!isFocused) {
      setText('');
    }
  }, [isFocused]);

  return (
    <>
      {selectedImage ? (
        <View style={styles.container}>
          <View style={styles.contents}>
            {selectedImage ? (
              <Image source={{uri: selectedImage}} style={styles.image} />
            ) : (
              <View style={{...styles.image, justifyContent: 'center'}}>
                <ActivityIndicator size="small" />
              </View>
            )}
            <TextInput
              style={styles.textInputArea}
              multiline={true}
              placeholder="テキストの入力"
              onChangeText={(t) => {
                setText(t);
              }}>
              {text}
            </TextInput>
          </View>
        </View>
      ) : (
        <View style={{...styles.container, justifyContent: 'center'}}>
          <ActivityIndicator />
        </View>
      )}
    </>
  );
};

const {height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  contents: {
    width: '100%',
    height: '19%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: height / 9,
    height: height / 9,
    marginLeft: 15,
  },
  textInputArea: {
    height: height / 9,
    width: '67%',
    marginLeft: 15,
  },
});

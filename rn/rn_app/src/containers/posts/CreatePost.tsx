import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import ImagePicker from 'react-native-image-picker';

import {CreatePost} from '../../components/posts/CreatePost';
import {createPostAction} from '../../actions/posts';
import {AppDispatch} from '../../redux';

export const Container = () => {
  const isFocused = useIsFocused();
  const [selectedImage, setSelectedImage] = useState<undefined | string>(
    undefined,
  );

  const navigationToGoBack = useNavigation();
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (isFocused) {
      ImagePicker.launchImageLibrary({quality: 0.5}, (response) => {
        if (response.didCancel) {
          navigationToGoBack.goBack();
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
  }, [isFocused, navigationToGoBack]);
  const createPost = async (data: {text: string; image: string}) => {
    await dispatch(createPostAction(data));
    navigationToGoBack.goBack();
  };

  return <CreatePost selectedImage={selectedImage} createPost={createPost} />;
};

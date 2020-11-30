import React from 'react';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import CameraRoll from '@react-native-community/cameraroll';

import {TakeFlash} from '../../components/flashs/TakeFlash';
import {AppDispatch} from '../../redux/index';
import {createFlashThunk} from '../../actions/flashes';
import fs from 'react-native-fs';

export const Container = () => {
  const navigaiton = useNavigation();

  const dispatch: AppDispatch = useDispatch();

  const backScreen = () => {
    navigaiton.goBack();
  };

  const createFlash = async ({
    content,
    contentType,
    uri,
  }: {
    content?: string;
    contentType: 'image' | 'video';
    uri: string;
  }) => {
    navigaiton.goBack();
    const length = uri.lastIndexOf('.');
    const ext = length !== -1 ? uri.slice(length + 1) : null;
    if (content && contentType === 'image') {
      dispatch(createFlashThunk({content, contentType, ext}));
    } else if (contentType === 'video') {
      const videoContent = await fs.readFile(uri, 'base64');
      dispatch(createFlashThunk({content: videoContent, contentType, ext}));
    }
    return;
  };

  const saveDataToCameraRoll = async (uri: string) => {
    try {
      await CameraRoll.save(uri);
      return;
    } catch {}
  };

  return (
    <TakeFlash
      goBack={backScreen}
      saveDataToCameraRoll={saveDataToCameraRoll}
      createFlash={createFlash}
    />
  );
};

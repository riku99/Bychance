import React from 'react';
import {useNavigation} from '@react-navigation/native';
import CameraRoll from '@react-native-community/cameraroll';

import {TakeFlash} from '../../components/flashs/TakeFlash';

export const Container = () => {
  const navigaiton = useNavigation();

  const backScreen = () => {
    navigaiton.goBack();
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
    />
  );
};

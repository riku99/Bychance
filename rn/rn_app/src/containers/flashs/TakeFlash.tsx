import React, {useRef, useState} from 'react';
import {RNCamera} from 'react-native-camera';
import {useNavigation} from '@react-navigation/native';

import {TakeFlash} from '../../components/flashs/TakeFlash';

export const Container = () => {
  const navigaiton = useNavigation();

  const backScreen = () => {
    navigaiton.goBack();
  };

  return <TakeFlash goBack={backScreen} />;
};

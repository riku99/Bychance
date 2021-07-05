import {useLayoutEffect} from 'react';
import {StatusBar} from 'react-native';

import {judgeMoreDeviceX} from '~/helpers/device';

const moreDeviceX = judgeMoreDeviceX();

export const useFlashStatusBarSetting = () => {
  useLayoutEffect(() => {
    StatusBar.setBarStyle('light-content');
    StatusBar.setHidden(!moreDeviceX ? true : false);

    return () => {
      StatusBar.setHidden(false);
      StatusBar.setBarStyle('default');
    };
  }, []);
};

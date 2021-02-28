import {useMemo} from 'react';
import {Dimensions} from 'react-native';

import {X_HEIGHT} from '../../constants/device';

const {height} = Dimensions.get('window');

export const useMoreDeviceX = () =>
  useMemo(() => {
    return height >= X_HEIGHT ? true : false;
  }, []);

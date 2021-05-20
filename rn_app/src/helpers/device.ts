import {Dimensions} from 'react-native';

import {X_HEIGHT} from '~/constants/device';

const {height} = Dimensions.get('window');

export const judgeMoreDeviceX = () => (height >= X_HEIGHT ? true : false);

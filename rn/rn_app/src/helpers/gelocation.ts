import Geolocation from 'react-native-geolocation-service';
import {Alert} from 'react-native';

import {alertSomeError} from '../helpers/error';

export const getCurrentPosition = async (): Promise<{
  lat: number;
  lng: number;
} | void> => {
  const currentPermission = await Geolocation.requestAuthorization('always');
  if (currentPermission === ('granted' || 'restricted')) {
    Geolocation.getCurrentPosition(
      (position) => {
        return {lat: position.coords.latitude, lng: position.coords.longitude};
      },
      (e) => {
        console.log(e);
        alertSomeError();
      },
    );
  } else if (currentPermission === ('denied' || 'disabled')) {
    Alert.alert(
      '位置情報が無効です',
      'アプリを使うにはデバイスの位置情報を有効にしてください',
      [
        {
          text: 'OK',
        },
      ],
    );
  }
};

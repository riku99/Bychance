import Geolocation from 'react-native-geolocation-service';
import {Alert} from 'react-native';

export const getCurrentPosition = (): Promise<Geolocation.GeoPosition | null> => {
  return new Promise(async (resolve) => {
    const currentPermission = await Geolocation.requestAuthorization('always');
    if (currentPermission === ('granted' || 'restricted')) {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve(position);
        },
        (e) => {
          console.log(e);
          // alertSomeError();
          resolve(null);
        },
      );
    } else if (currentPermission === ('denied' || 'disabled')) {
      Alert.alert(
        '位置情報が無効です',
        'アプリを使うにはデバイスの位置情報を有効にしてください',
        [
          {
            text: 'OK',
            onPress: () => {
              resolve(null);
            },
          },
        ],
      );
    }
  });
};

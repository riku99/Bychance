import {Alert} from 'react-native';

export const notAuthLocationProviderAlert = () => {
  Alert.alert(
    '位置情報がオフになっています',
    'バックグラウンドでも位置情報に関連したサービスを利用するには端末の設定から「常に」を設定してください',
  );
};

export const notLocationInfoAlert = () => {
  Alert.alert('位置情報がありません', 'メニューから位置情報を更新してください');
};

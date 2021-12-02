import messaging from '@react-native-firebase/messaging';

// push通知の許可リクエスト
export const requestPushNotification = async () => {
  const authStatus = await messaging().hasPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (!enabled) {
    await messaging().requestPermission();
  }
};

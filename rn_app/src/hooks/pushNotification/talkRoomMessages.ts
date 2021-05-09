import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';

export const useRegisterRecieveTalkRoomMessages = ({
  login,
}: {
  login: boolean;
}) => {
  useEffect(() => {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('backgroundでメッセージを受け取りました: ' + remoteMessage);
    });
  }, [login]);
};

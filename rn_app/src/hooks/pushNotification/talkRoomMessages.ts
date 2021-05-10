import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';

import {useCustomDispatch} from '~/hooks/stores/dispatch';
import {receiveMessage} from '~/stores/messages';
import {ReceivedMessageData} from '~/stores/types';

export const useRegisterRecieveTalkRoomMessages = ({
  login,
}: {
  login: boolean;
}) => {
  const dispatch = useCustomDispatch();
  useEffect(() => {
    if (login) {
      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log('backgroundでメッセージを受け取りました: ');
        console.log(remoteMessage.data);
        const data = remoteMessage.data as unknown;
        dispatch(receiveMessage(data as ReceivedMessageData));
      });
    }
  }, [login, dispatch]);
};

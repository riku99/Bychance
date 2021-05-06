import React, {useEffect} from 'react';
import {View} from 'react-native';
import {Socket} from 'socket.io-client';
import {useDispatch} from 'react-redux';
import {showMessage} from 'react-native-flash-message';

import {ReceivedMessageData} from '~/stores/types';
import {receiveMessage} from '~/stores/messages';
import {UserAvatar} from '~/components/utils/Avatar';

export const useRecieveTalkRoomMessage = ({socket}: {socket?: Socket}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (socket) {
      socket.on('recieveTalkRoomMessage', (data: ReceivedMessageData) => {
        dispatch(receiveMessage(data));
        showMessage({
          message: data.sender.name,
          description: data.message.text,
          style: {backgroundColor: '#00163b'},
          titleStyle: {color: 'white', marginLeft: 10},
          textStyle: {color: 'white', marginLeft: 10},
          icon: 'default',
          duration: 2500,
          renderFlashMessageIcon: () => {
            return (
              <View style={{marginRight: 5}}>
                <UserAvatar size={40} image={data.sender.avatar} />
              </View>
            );
          },
        });
      });
    }
  }, [socket, dispatch]);
};

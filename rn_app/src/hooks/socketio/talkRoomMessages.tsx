import React, {useEffect} from 'react';
import {View, AppState} from 'react-native';
import {Socket} from 'socket.io-client';
import {useDispatch} from 'react-redux';
import {showMessage} from 'react-native-flash-message';

import {ReceivedMessageData} from '~/stores/types';
import {receiveTalkRoomMessage} from '~/stores/talkRoomMessages';
import {UserAvatar} from '~/components/utils/Avatar';

// メッセージの反映にはとりあえずpush通知ではなくてsocketで行う(push通知自体はある)
// なぜなら、setBackgroundMessageHandlerの処理が通知がきてからラグがあり、通知きてすぐにアプリ開くとメッセージがまだ反映されていない状態になってしまっているから
// ラグ直せたらpush通知の処理の方でメッセージの反映も行う
export const useRecieveTalkRoomMessage = ({socket}: {socket?: Socket}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (socket) {
      socket.on('recieveTalkRoomMessage', (data: ReceivedMessageData) => {
        console.log('socket!');
        dispatch(receiveTalkRoomMessage(data));
        if (AppState.currentState === 'active') {
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
        }
      });
    }
  }, [socket, dispatch]);
};

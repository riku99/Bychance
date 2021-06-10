import React, {useEffect, useState} from 'react';
import {View, AppState} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import io, {Socket} from 'socket.io-client';

import {ReceivedMessageData} from '~/stores/types';
import {receiveTalkRoomMessage} from '~/stores/talkRoomMessages';
import {UserAvatar} from '~/components/utils/Avatar';
import {useCustomDispatch} from '~/hooks/stores/dispatch';

//const _origin = 'http://192.168.128.159:4001';
const _origin = 'http://localhost:4001';
//const _origin = 'http://192.168.3.6:4001';

// メッセージの反映にはとりあえずpush通知ではなくてsocketで行う(push通知自体はある)
// なぜなら、setBackgroundMessageHandlerの処理が通知がきてからラグがあるのとこのメソッドがかなり不安定なのとpush通知OFFの時の処理がめんどいから
export const useTalkRoomMessagesIo = ({id}: {id?: string}) => {
  const dispatch = useCustomDispatch();

  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    if (id) {
      setSocket(io(`${_origin}/talkRoomMessages`, {query: {id}}));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (socket) {
      if (id) {
        socket.on('recieveTalkRoomMessage', (data: ReceivedMessageData) => {
          dispatch(receiveTalkRoomMessage(data));
          if (AppState.currentState === 'active' && data.show) {
            showMessage({
              message: data.sender.name,
              description: data.message.text,
              style: {backgroundColor: '#00163b'},
              titleStyle: {color: 'white', marginLeft: 10},
              textStyle: {color: 'white', marginLeft: 10},
              icon: 'default',
              duration: 2000,
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

        // https://socket.io/docs/v3/client-socket-instance/
        // disconnectイベントはサーバーが落ちた時とかに発火される。他にも理由いくつかある。
        // サーバー側からのsocket.disconnect()が起こった時、そしてクライアント側からsocket.disconnect()が起こった時には再接続は自動で行われない。逆に他の理由では行われる
        // クライアント側でdisconectした場合は再接続を試みる必要はないし、現在サーバー側でdisconnectしている場面もないので手動で再接続を試みる必要はない。なのでdisconnectイベントのハンドラはいったん必要ない
        // socket.on('disconnect', (reason) => {});
      } else {
        socket.disconnect();
      }
    }
  }, [socket, id, dispatch]);
};

import React, {useEffect, useLayoutEffect, useState} from 'react';
import {IMessage} from 'react-native-gifted-chat';
import {RouteProp} from '@react-navigation/native';
import {useSelector} from 'react-redux';

import {Chat} from './Chat';
import {TalkRoomStackNavigationProp} from '../../../navigations/types';
import {TalkRoomStackParamList} from '../../../navigations/TalkRoom';
import {
  useCreateReadTalkRoomMessages,
  useCreateTalkRoomMessage,
} from '~/hooks/talkRoomMessages';
import {useGetMessages} from '~/hooks/talkRoomMessages';
import {useMyId} from '~/hooks/users';
import {selectRoom} from '~/stores/_talkRooms';
import {RootState} from '~/stores';

type RootRouteProp = RouteProp<TalkRoomStackParamList, 'TalkRoom'>;

type Props = {
  route: RootRouteProp;
  navigation: TalkRoomStackNavigationProp<'TalkRoom'>;
};

export const TalkRoom = ({route, navigation}: Props) => {
  const {talkRoomId, partner} = route.params;
  const {result} = useGetMessages({talkRoomId});
  const [messages, setMessages] = useState<IMessage[]>([]);
  const myId = useMyId();
  const {createMessage} = useCreateTalkRoomMessage();
  const lastMessage = useSelector((state: RootState) => {
    const room = selectRoom(state, talkRoomId);
    if (room) {
      return room.lastMessage;
    }
  });
  useCreateReadTalkRoomMessages({
    talkRoomId,
  });

  useEffect(() => {
    if (result?.length) {
      const iData = result.map((d) => ({
        _id: d.id,
        text: d.text,
        createdAt: new Date(d.createdAt),
        user: {
          _id: d.userId,
          avatar:
            d.userId !== myId && partner.avatar ? partner.avatar : undefined,
        },
      }));
      setMessages(iData);
    }
  }, [result, partner.avatar, myId]);

  useEffect(() => {
    if (lastMessage && myId !== lastMessage.userId) {
      setMessages((current) => {
        const filtered = current.filter((d) => d._id !== lastMessage.id);
        return [
          {
            _id: lastMessage.id,
            text: lastMessage.text,
            createdAt: new Date(lastMessage.createdAt),
            user: {
              _id: lastMessage.userId,
              avatar:
                lastMessage.userId !== myId && partner.avatar
                  ? partner.avatar
                  : undefined,
            },
          },
          ...filtered,
        ];
      });
    }
  }, [lastMessage, myId, partner.avatar]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: partner.name,
    });
  });

  const onSend = async (text: string) => {
    const temporaryId = Math.random().toString(32).substring(2); //一時的なIDのためのランダムな文字列
    const newMessage = {
      _id: temporaryId,
      text,
      createdAt: new Date(),
      user: {
        _id: myId,
      },
    };

    // レスポンス待ってセットすると若干のタイムラグがあるので先に仮のデータをセット
    setMessages((current) => [newMessage, ...current]);

    const _result = await createMessage({
      roomId: talkRoomId,
      partnerId: partner.id,
      text,
    });

    if (_result) {
      const {message} = _result;
      // レスポンス取得した仮のデータを変更する
      setMessages((current) => {
        const filtered = current.filter((m) => m._id !== temporaryId);
        return [
          {
            _id: message.id,
            text: message.text,
            createdAt: new Date(message.createdAt),
            user: {
              _id: message.userId,
              avatar:
                message.userId !== myId && partner.avatar
                  ? partner.avatar
                  : undefined,
            },
          },
          ...filtered,
        ];
      });
    } else {
      setMessages((current) => current.filter((m) => m._id !== temporaryId)); // レスポンス取得できなかったら仮データも削除
    }
  };

  return <Chat messages={messages} userId={myId} onSend={onSend} />;
};

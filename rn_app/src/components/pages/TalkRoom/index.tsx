import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {IMessage} from 'react-native-gifted-chat';
import {RouteProp} from '@react-navigation/native';

import {ChatRoom} from './ChatRoom';
import {ChatRoomStackNavigationProp} from '../../../screens/types';
import {AppDispatch, RootState} from '../../../stores/index';
import {selectMessages} from '../../../stores/messages';
import {resetUnreadNumber, selectRoom} from '../../../stores/talkRooms';
import {selectChatPartner} from '../../../stores/chatPartners';
import {resetRecievedMessage} from '../../../stores/otherSettings';
import {createMessageThunk} from '../../../actions/talkRoomMessages/createTalkRoomMessage';
import {createReadMessagesThunk} from '../../../actions/talkRoomMessages/createReadMessage';
import {ChatRoomStackParamList} from '../../../screens/ChatRoom';
import {UserAvatar} from '../../utils/Avatar';

type RootRouteProp = RouteProp<ChatRoomStackParamList, 'ChatRoom'>;

type Props = {
  route: RootRouteProp;
  navigation: ChatRoomStackNavigationProp<'ChatRoom'>;
};

export const ChatRoomPage = ({route, navigation}: Props) => {
  const myId = useSelector((state: RootState) => state.userReducer.user!.id);

  const room = useSelector((state: RootState) => {
    const _room = selectRoom(state, route.params.roomId);
    if (_room) {
      return _room;
    } else {
      throw new Error('not found room');
    }
  }, shallowEqual);

  const selectedMessages = useSelector((state: RootState) => {
    if (room) {
      return selectMessages(state, room?.messages);
    }
  }, shallowEqual);

  const partner = useSelector((state: RootState) =>
    selectChatPartner(state, route.params.partnerId),
  );

  const onAvatarPress = useCallback(() => {
    if (partner) {
      navigation.push('UserPage', {
        userId: partner.id,
        from: 'chatRoom',
      });
    }
  }, [navigation, partner]);

  const [messages, setMessages] = useState<IMessage[]>(() => {
    if (selectedMessages && selectedMessages.length) {
      const _messages = selectedMessages.map((m) => {
        return {
          _id: m.id,
          text: m.text,
          createdAt: new Date(m.timestamp),
          user: {
            _id: m.userId,
            avatar: () => (
              <UserAvatar
                image={partner?.avatar}
                size={'small'}
                opacity={0}
                onPress={onAvatarPress}
              />
            ),
          },
        };
      });
      return _messages;
    } else {
      return [];
    }
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: partner?.name ? partner.name : 'ユーザーが存在しません',
    });
  });

  const dispatch: AppDispatch = useDispatch();

  // チャットルームを開いている時にwsでメッセージを受け取った時のためのセレクタ
  const receivedMessage = useSelector((state: RootState) => {
    return state.otherSettingsReducer.receivedMessage;
  });

  // チャットルームを開いている時にwsでメッセージを受け取った場合のためのeffect
  // wsでメッセージを受け取り、そのメッセージがこのルーム宛のものであれば表示
  useEffect(() => {
    if (receivedMessage && receivedMessage.roomId === room.id) {
      setMessages((m) => {
        return [
          {
            _id: receivedMessage.id,
            text: receivedMessage.text,
            createdAt: new Date(receivedMessage.timestamp),
            user: {
              _id: receivedMessage.userId,
              avatar: () => (
                <UserAvatar
                  image={partner?.avatar}
                  size={'small'}
                  opacity={0}
                  onPress={onAvatarPress}
                />
              ),
            },
          },
          ...m,
        ];
      });
      // 追加した時点でもう必要ないのでリセット
      dispatch(resetRecievedMessage());
      // ルームを開いている状態で取得したメッセージなので未読数を0にする
      dispatch(resetUnreadNumber({roomId: room.id}));
      // 既読データをサーバの方で作成
      dispatch(
        createReadMessagesThunk({
          roomId: room.id,
          unreadNumber: 1,
          partnerId: route.params.partnerId,
        }),
      );
    }
  }, [
    receivedMessage,
    room.id,
    partner?.avatar,
    onAvatarPress,
    room.messages,
    dispatch,
    route.params.partnerId,
  ]);

  useEffect(() => {
    if (room) {
      // ルームが開かれたら未読を0にする
      const unsubscribe = navigation.addListener('focus', () => {
        if (room.unreadNumber !== 0) {
          dispatch(resetUnreadNumber({roomId: room.id}));
          dispatch(
            createReadMessagesThunk({
              roomId: room.id,
              unreadNumber: room.unreadNumber,
              partnerId: route.params.partnerId,
            }),
          );
        }
      });

      return unsubscribe;
    }
  }, [navigation, room, dispatch, route.params.partnerId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      dispatch(resetRecievedMessage());
    });

    return unsubscribe;
  }, [navigation, dispatch]);

  // メッセージの送信
  const onSend = useCallback(
    async (text: string) => {
      if (room) {
        const result = await dispatch(
          createMessageThunk({
            roomId: room.id,
            partnerId: route.params.partnerId,
            text,
            isFirstMessage: room.messages.length ? false : true,
          }),
        );
        if (createMessageThunk.fulfilled.match(result)) {
          const _message = result.payload.message;
          // 送信したメッセージを追加
          setMessages([
            {
              _id: _message.id,
              text: _message.text,
              createdAt: new Date(_message.timestamp),
              user: {
                _id: _message.userId,
              },
            },
            ...messages,
          ]);
        }
      }
    },
    [room, dispatch, route.params.partnerId, messages],
  );

  return <ChatRoom messages={messages} userId={myId} onSend={onSend} />;
};

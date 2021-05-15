import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {IMessage} from 'react-native-gifted-chat';
import {RouteProp} from '@react-navigation/native';

import {ChatRoom} from './TaklRoom';
import {TalkRoomStackNavigationProp} from '../../../screens/types';
import {AppDispatch, RootState} from '../../../stores/index';
import {selectMessages} from '../../../stores/talkRoomMessages';
import {resetUnreadNumber, selectRoom} from '../../../stores/talkRooms';
import {selectChatPartner} from '../../../stores/chatPartners';
import {resetRecievedMessage} from '../../../stores/otherSettings';
import {createMessageThunk} from '../../../apis/talkRoomMessages/createTalkRoomMessage';
import {createReadMessagesThunk} from '../../../apis/talkRoomMessages/createReadTalkRoomMessage';
import {TalkRoomStackParamList} from '../../../screens/ChatRoom';
import {UserAvatar} from '../../utils/Avatar';

type RootRouteProp = RouteProp<TalkRoomStackParamList, 'ChatRoom'>;

type Props = {
  route: RootRouteProp;
  navigation: TalkRoomStackNavigationProp<'ChatRoom'>;
};

export const TalkRoom = ({route, navigation}: Props) => {
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
      return selectMessages(state, room.messages);
    } else {
      return [];
    }
  }, shallowEqual);

  const partner = useSelector(
    (state: RootState) => selectChatPartner(state, route.params.partnerId),
    shallowEqual,
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
  const messageIds = useMemo(() => messages.map((m) => m._id), [messages]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: partner?.name ? partner.name : 'ユーザーが存在しません',
    });
  });

  const dispatch: AppDispatch = useDispatch();

  // チャットルームを開いている時にメッセージを受け取った時のためのセレクタ
  const receivedMessage = useSelector((state: RootState) => {
    return state.otherSettingsReducer.receivedMessage;
  }, shallowEqual);

  // チャットルームを開いている時にでメッセージを受け取った場合のためのeffect。メッセージを受け取り、そのメッセージがこのルーム宛のものであれば表示
  useEffect(() => {
    if (
      receivedMessage &&
      receivedMessage.roomId === room.id &&
      !messageIds.includes(receivedMessage.id)
    ) {
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
    route.params.partnerId,
    onAvatarPress,
    dispatch,
    messageIds,
  ]);

  useEffect(() => {
    if (room) {
      dispatch(resetRecievedMessage());
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

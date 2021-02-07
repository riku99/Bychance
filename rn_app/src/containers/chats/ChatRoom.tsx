import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {IMessage} from 'react-native-gifted-chat';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {ChatRoom} from '../../components/chats/ChatRoom';
import {AppDispatch, RootState} from '../../redux/index';
import {selectMessages} from '../../redux/messages';
import {resetUnreadNumber} from '../../redux/rooms';
import {selectChatPartner} from '../../redux/chatPartners';
import {resetRecievedMessage} from '../../redux/otherSettings';
import {
  createMessageThunk,
  createReadMessagesThunk,
} from '../../actions/messages';
import {ChatRoomStackParamList} from '../../screens/ChatRoom';
import {UserAvatar} from '../../components/utils/Avatar';

type RootRouteProp = RouteProp<ChatRoomStackParamList, 'ChatRoom'>;

type ChatRoomStackNavigationProp = StackNavigationProp<
  ChatRoomStackParamList,
  'ChatRoom'
>;

type Props = {route: RootRouteProp; navigation: ChatRoomStackNavigationProp};

export const Container = ({route, navigation}: Props) => {
  const myId = useSelector((state: RootState) => state.userReducer.user!.id);

  const selectedMessages = useSelector((state: RootState) => {
    return selectMessages(state, route.params.room.messages);
  }, shallowEqual);

  const partner = useSelector((state: RootState) =>
    selectChatPartner(state, route.params.partnerId),
  );

  // チャットルームを開いている時にwsでメッセージを受け取った時のためのセレクタ
  const receivedMessage = useSelector((state: RootState) => {
    return state.otherSettingsReducer.receivedMessage;
  }, shallowEqual);

  const navigateToProfile = useCallback(() => {
    navigation.push('UserPage', {
      roomId: route.params.room.id,
      from: 'chatRoom',
    });
  }, [navigation, route.params.room.id]);

  const [messages, setMessages] = useState<IMessage[]>(() => {
    if (selectedMessages.length) {
      const _messages = selectedMessages.map((m) => {
        return {
          _id: m.id,
          text: m.text,
          createdAt: new Date(m.timestamp),
          user: {
            _id: m.userId,
            avatar: () => (
              <UserAvatar
                image={partner?.image}
                size={'small'}
                opacity={0}
                onPress={navigateToProfile}
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
    navigation.setOptions({headerTitle: partner?.name});
  });

  const dispatch: AppDispatch = useDispatch();

  // チャットルームを開いている時にwsでメッセージを受け取った場合のためのeffect
  // wsでメッセージを受け取り、そのメッセージがこのルーム宛のものであれば表示
  useEffect(() => {
    if (
      receivedMessage &&
      receivedMessage.roomId === route.params.room.id &&
      receivedMessage.id !== route.params.room.messages[0]
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
                  image={partner?.image}
                  size={'small'}
                  opacity={0}
                  onPress={navigateToProfile}
                />
              ),
            },
          },
          ...m,
        ];
      });
      // ルームを開いている状態で取得したメッセージなので未読数を0にする
      dispatch(resetUnreadNumber({roomId: route.params.room.id}));
      // 既読データをサーバの方で作成
      dispatch(
        createReadMessagesThunk({
          roomId: route.params.room.id,
          unreadNumber: 1,
        }),
      );
    }
  }, [
    receivedMessage,
    route.params.room.id,
    partner?.image,
    route.params.room.messages,
    navigateToProfile,
    dispatch,
  ]);

  useEffect(() => {
    // ルームが開かれたら未読を0にする
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params.room.unreadNumber !== 0) {
        dispatch(resetUnreadNumber({roomId: route.params.room.id}));
        dispatch(
          createReadMessagesThunk({
            roomId: route.params.room.id,
            unreadNumber: route.params.room.unreadNumber,
          }),
        );
      }
    });

    return unsubscribe;
  }, [navigation, route.params, dispatch]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      dispatch(resetRecievedMessage());
    });

    return unsubscribe;
  }, [navigation, dispatch]);

  const onSend = useCallback(
    async (text: string) => {
      const result = await dispatch(
        createMessageThunk({
          roomId: route.params.room.id,
          userId: myId,
          text,
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
    },
    [route.params.room.id, dispatch, myId, messages],
  );

  return <ChatRoom messages={messages} userId={myId} onSend={onSend} />;
};

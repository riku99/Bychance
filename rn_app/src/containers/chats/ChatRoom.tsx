import React, {useCallback, useEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {IMessage} from 'react-native-gifted-chat';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {ChatRoom} from '../../components/chats/ChatRoom';
import {AppDispatch, RootState} from '../../redux/index';
import {selectMessages} from '../../redux/messages';
import {resetUnreadNumber} from '../../redux/rooms';
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
  const userId = useSelector((state: RootState) => state.userReducer.user!.id);

  const selectedMessages = useSelector((state: RootState) => {
    return selectMessages(state, route.params.messages);
  }, shallowEqual);

  // チャットルームを開いている時にwsでメッセージを受け取った時のためのセレクタ
  const receivedMessage = useSelector((state: RootState) => {
    return state.otherSettingsReducer.receivedMessage;
  }, shallowEqual);

  const navigateToProfile = useCallback(() => {
    navigation.push('Profile', route.params.partner);
  }, [navigation, route.params.partner]);

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
                image={route.params.partner.image}
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

  const dispatch: AppDispatch = useDispatch();

  // チャットルームを開いている時にwsでメッセージを受け取った場合のためのeffect
  useEffect(() => {
    if (
      receivedMessage &&
      receivedMessage.roomId === route.params.id &&
      receivedMessage.id !== route.params.messages[0]
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
                  image={route.params.partner.image}
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
      // 未読数を0にする
      dispatch(resetUnreadNumber({roomId: route.params.id}));
      // 既読データを作成
      dispatch(
        createReadMessagesThunk({
          roomId: route.params.id,
          unreadNumber: 1,
        }),
      );
    }
  }, [
    receivedMessage,
    route.params.id,
    route.params.partner.image,
    route.params.messages,
    navigateToProfile,
    dispatch,
  ]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params.unreadNumber !== 0) {
        dispatch(resetUnreadNumber({roomId: route.params.id}));
        dispatch(
          createReadMessagesThunk({
            roomId: route.params.id,
            unreadNumber: route.params.unreadNumber,
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
          roomId: route.params.id,
          userId: userId,
          text,
        }),
      );
      if (createMessageThunk.fulfilled.match(result)) {
        const _message = result.payload.message;
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
    [route.params.id, dispatch, userId, messages],
  );

  return <ChatRoom messages={messages} userId={userId} onSend={onSend} />;
};

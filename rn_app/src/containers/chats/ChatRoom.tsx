import React, {useCallback, useEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {IMessage} from 'react-native-gifted-chat';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {ChatRoom} from '../../components/chats/ChatRoom';
import {AppDispatch, RootState} from '../../redux/index';
import {
  createMessageThunk,
  createReadMessagesThunk,
} from '../../actions/messages';
import {ChatRoomStackParamParamList} from '../../screens/ChatRoom';
import {selectMessages} from '../../redux/messages';
import {resetUnreadNumber} from '../../redux/rooms';
import {UserAvatar} from '../../components/utils/Avatar';

type RootRouteProp = RouteProp<ChatRoomStackParamParamList, 'ChatRoom'>;

type ChatRoomStackNavigationProp = StackNavigationProp<
  ChatRoomStackParamParamList,
  'ChatRoom'
>;

type Props = {route: RootRouteProp; navigation: ChatRoomStackNavigationProp};

export const Container = ({route, navigation}: Props) => {
  const userId = useSelector((state: RootState) => state.userReducer.user!.id);

  const selectedMessages = useSelector((state: RootState) => {
    const messageIds = route.params.messages;
    return selectMessages(state, messageIds);
  }, shallowEqual);

  const navigateToProfile = () => {
    navigation.push('Profile', route.params.partner);
  };

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

  // useEffect(() => {
  //   if (isFocused && selectedMessages[0] && !selectedMessages[0].read) {
  //     const ids = selectedMessages
  //       .map((message) => {
  //         if (!message.read && message.userId !== userId) {
  //           return message.id;
  //         }
  //       })
  //       .filter((n): n is number => {
  //         return typeof n === 'number';
  //       });
  //     dispatch(changeMessagesReadThunk(ids));
  //   }
  // }, [isFocused, selectedMessages, dispatch, userId]);

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

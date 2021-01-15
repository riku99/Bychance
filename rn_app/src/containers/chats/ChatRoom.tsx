import React, {useMemo, useCallback, useEffect} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {IMessage} from 'react-native-gifted-chat';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useIsFocused} from '@react-navigation/native';
import {Avatar} from 'react-native-elements';

import {ChatRoom} from '../../components/chats/ChatRoom';
import {RootState} from '../../redux/index';
import {
  createMessageThunk,
  changeMessagesReadThunk,
} from '../../actions/messages';
import {ChatRoomStackParamParamList} from '../../screens/ChatRoom';
import {selectMessages} from '../../redux/messages';
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

  const messages: IMessage[] = useMemo(() => {
    const navigateToProfile = () => {
      navigation.push('Profile', route.params.partner);
    };
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
  }, [route.params.partner, selectedMessages, navigation]);

  const isFocused = useIsFocused();

  const dispatch = useDispatch();

  useEffect(() => {
    if (isFocused && selectedMessages[0] && !selectedMessages[0].read) {
      const ids = selectedMessages
        .map((message) => {
          if (!message.read && message.userId !== userId) {
            return message.id;
          }
        })
        .filter((n): n is number => {
          return typeof n === 'number';
        });
      dispatch(changeMessagesReadThunk(ids));
    }
  }, [isFocused, selectedMessages, dispatch, userId]);

  const onSend = useCallback(
    (text: string) => {
      dispatch(
        createMessageThunk({
          roomId: route.params.id,
          userId: userId,
          text,
        }),
      );
    },
    [route.params.id, dispatch, userId],
  );

  return <ChatRoom messages={messages} userId={userId} onSend={onSend} />;
};

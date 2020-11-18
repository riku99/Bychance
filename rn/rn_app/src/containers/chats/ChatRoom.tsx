import React, {useMemo, useCallback, useEffect} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {IMessage} from 'react-native-gifted-chat';
import {RouteProp} from '@react-navigation/native';
import {useIsFocused} from '@react-navigation/native';

import {ChatRoom} from '../../components/chats/ChatRoom';
import {RootState} from '../../redux/index';
import {
  createMessageThunk,
  changeMessagesReadThunk,
} from '../../actions/messages';
import {RootStackParamList} from '../../screens/Root';
import {selectMessages} from '../../redux/messages';
import {selectMessageIds} from '../../redux/rooms';

const noImage = require('../../assets/no-Image.png');

type RootRouteProp = RouteProp<RootStackParamList, 'ChatRoom'>;

type Props = {route: RootRouteProp};

export const Container = ({route}: Props) => {
  const {userId} = useSelector((state: RootState) => {
    return {
      userId: state.userReducer.user!.id,
    };
  }, shallowEqual);

  const selectedMessages = useSelector((state: RootState) => {
    const messageIds = selectMessageIds(state, route.params.id);
    return selectMessages(state, messageIds);
  }, shallowEqual);

  const messages: IMessage[] = useMemo(() => {
    if (selectedMessages.length) {
      const _messages = selectedMessages.map((m) => {
        return {
          _id: m.id,
          text: m.text,
          createdAt: new Date(m.timestamp),
          user: {
            _id: m.userId,
            avatar: route.params.partner.image
              ? route.params.partner.image
              : noImage,
          },
        };
      });
      return _messages;
    } else {
      return [];
    }
  }, [route.params.partner.image, selectedMessages]);

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

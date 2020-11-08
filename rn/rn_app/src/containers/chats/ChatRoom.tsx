import React, {useMemo, useCallback} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {IMessage} from 'react-native-gifted-chat';

import {ChatRoom} from '../../components/chats/ChatRoom';
import {RootState} from '../../redux/index';
import {createMessageThunk} from '../../actions/chats';

const noImage = require('../../assets/no-Image.png');

export const Container = () => {
  const chat = useSelector((state: RootState) => {
    return state.chatReducer.currentChat!;
  }, shallowEqual);

  const {id} = useSelector((state: RootState) => {
    return {
      id: state.userReducer.user!.id,
    };
  }, shallowEqual);

  const messages: IMessage[] = useMemo(() => {
    if (chat.messages.length) {
      const _messages = chat.messages.map((m) => {
        return {
          _id: m.id,
          text: m.text,
          createdAt: new Date(m.timestamp),
          user: {
            _id: m.userId,
            avatar: chat.partner.image ? chat.partner.image : noImage,
          },
        };
      });
      return _messages;
    } else {
      return [];
    }
  }, [chat.messages, chat.partner.image]);

  const dispatch = useDispatch();

  const onSend = useCallback(
    (text: string) => {
      dispatch(
        createMessageThunk({
          roomId: chat.id,
          userId: id,
          text,
        }),
      );
    },
    [chat.id, id, dispatch],
  );

  return <ChatRoom messages={messages} userId={id} onSend={onSend} />;
};

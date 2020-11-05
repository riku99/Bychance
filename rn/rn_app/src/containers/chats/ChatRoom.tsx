import React, {useEffect, useState, useRef} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {IMessage} from 'react-native-gifted-chat';

import {ChatRoom} from '../../components/chats/ChatRoom';
import {RootState} from '../../redux/index';
import {createMessageThunk} from '../../actions/chats';

const noImage = require('../../assets/no-Image.png');

export const Container = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);

  const chat = useSelector((state: RootState) => {
    return state.chatReducer.currentChat!;
  }, shallowEqual);

  const {id, image} = useSelector((state: RootState) => {
    return {
      id: state.userReducer.user!.id,
      image: state.userReducer.user!.image,
    };
  }, shallowEqual);

  useEffect(() => {
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
      setMessages(_messages);
    }
  }, [chat.messages, chat.partner.id, chat.partner.image, image]);

  const dispatch = useDispatch();

  const onSend = (text: string) => {
    dispatch(
      createMessageThunk({
        roomId: chat.id,
        userId: id,
        text,
      }),
    );
  };

  return <ChatRoom messages={messages} userId={id} onSend={onSend} />;
};

import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {GiftedChat, IMessage} from 'react-native-gifted-chat';

export const MessageExchange = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello world',
        createdAt: new Date(),
        user: {
          _id: 2,
          avatar:
            'https://profile.line-scdn.net/0hdXCqaRjAO3d-CBI8feJEIEJNNRoJJj0_Bjt1GVIPMhQAaywlQmtwE10LbUBWOygpET12GQkNZkEE',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((message) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, message),
    );
  }, []);

  return (
    <GiftedChat
      messages={messages}
      user={{_id: 1}}
      onSend={(message) => {
        onSend(message);
      }}
    />
  );
};

const styles = StyleSheet.create({});

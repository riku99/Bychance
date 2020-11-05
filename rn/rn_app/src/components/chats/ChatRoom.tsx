import React, {useState, useEffect, useCallback} from 'react';
import {Text, StyleSheet} from 'react-native';
//import {StyleSheet} from 'react-native';
import {
  GiftedChat,
  IMessage,
  Send,
  Bubble,
  MessageText,
} from 'react-native-gifted-chat';

export const ChatRoom = () => {
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
      placeholder="メッセージを入力"
      alignTop={true}
      renderSend={(props) => {
        return (
          <Send {...props} containerStyle={styles.sendContainer}>
            <Text style={styles.sendButtonTitile}>送信</Text>
          </Send>
        );
      }}
      renderBubble={(props) => {
        return (
          <Bubble
            {...props}
            wrapperStyle={{
              left: props.wrapperStyle?.left,
              right: {backgroundColor: '#c9c9c9'},
            }}
          />
        );
      }}
      renderMessageText={(props) => {
        return (
          <MessageText
            {...props}
            textStyle={{
              left: props.textStyle?.left,
              right: {color: 'balck'},
            }}
          />
        );
      }}
      onSend={(message) => {
        onSend(message);
      }}
    />
  );
};

const styles = StyleSheet.create({
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginRight: 15,
  },
  sendButtonTitile: {
    color: '#4fa9ff',
    fontWeight: 'bold',
  },
});

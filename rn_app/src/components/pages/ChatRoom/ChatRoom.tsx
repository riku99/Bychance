import React, {useState} from 'react';
import {Text, StyleSheet} from 'react-native';
import {
  GiftedChat,
  IMessage,
  Send,
  Bubble,
  MessageText,
} from 'react-native-gifted-chat';

type Props = {
  messages: IMessage[];
  userId: string;
  onSend: (text: string) => void;
};

export const ChatRoom = React.memo(({messages, userId, onSend}: Props) => {
  const [text, setText] = useState('');
  return (
    <GiftedChat
      messages={messages}
      user={{_id: userId}}
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
              right: {color: 'black'},
            }}
          />
        );
      }}
      onInputTextChanged={(t) => {
        setText(t);
      }}
      onSend={() => {
        onSend(text);
      }}
    />
  );
});

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

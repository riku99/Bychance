import React, {useState} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {
  GiftedChat,
  IMessage,
  Send,
  Bubble,
  MessageText,
} from 'react-native-gifted-chat';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  messages: IMessage[];
  userId: string;
  onSend: (text: string) => Promise<void>;
  onAvatarPress: () => void;
};

export const Chat = React.memo(
  ({messages, userId, onSend, onAvatarPress}: Props) => {
    const {bottom} = useSafeAreaInsets();
    const [text, setText] = useState('');
    return (
      <>
        <GiftedChat
          messages={messages}
          user={{_id: userId}}
          placeholder="メッセージを入力"
          bottomOffset={bottom}
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
          onPressAvatar={onAvatarPress}
        />
        <View style={{height: bottom}} />
      </>
    );
  },
);

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

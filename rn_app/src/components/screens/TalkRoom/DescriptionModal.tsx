import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {AlertMarkModal} from '~/components/utils/AlertMarkModal';
import {useDescriptionOfNotGettingTalkRoomMessageShowed} from '~/hooks/experiences';

export const DescriptionModal = () => {
  const {
    descriptionOfNotGettingTalkRoomMessageShowed,
    setDescriptionOfNotGettingTalkRoomMessageShowed,
    changeDescriptionOfNotGettingTalkRoomMessageShowed,
  } = useDescriptionOfNotGettingTalkRoomMessageShowed();
  return (
    <AlertMarkModal
      isVisible={!descriptionOfNotGettingTalkRoomMessageShowed}
      closeButtonPress={() => {
        setDescriptionOfNotGettingTalkRoomMessageShowed(true);
        changeDescriptionOfNotGettingTalkRoomMessageShowed(true);
      }}>
      <Text style={styles.text}>
        相手ユーザーが設定で
        <Text style={styles.textBold}>「メッセージを受け取る」</Text>
        をOFFにしている場合、
        <Text style={styles.textUnderColor}>
          送信したメッセージは相手に届きません。
        </Text>
        {'\n'}
        {'\n'}
        相手の設定がONになっているかOFFになっているかを知ることはできません。
        {'\n'}
        {'\n'}
        <Text style={styles.textSub}>※ 今後このお知らせは表示されません</Text>
      </Text>
    </AlertMarkModal>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 21,
  },
  textBold: {
    fontWeight: 'bold',
  },
  textUnderColor: {
    textDecorationLine: 'underline',
    textDecorationColor: '#f54242',
  },
  textSub: {
    color: '#242424',
    fontSize: 14,
  },
});

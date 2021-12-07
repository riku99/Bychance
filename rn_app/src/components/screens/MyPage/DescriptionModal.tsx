import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {AlertMarkModal} from '~/components/utils/AlertMarkModal';
import {useDescriptionOfMyDisplayShowed} from '~/hooks/experiences';

export const DescriptionModal = () => {
  const {
    descriptionOfMyDisplayShowed,
    setDescriptionOfMyDisplayShowed,
    changeDescriptionOfMyDisplayShowed,
  } = useDescriptionOfMyDisplayShowed();

  return (
    <AlertMarkModal
      isVisible={!descriptionOfMyDisplayShowed}
      closeButtonPress={() => {
        setDescriptionOfMyDisplayShowed(true);
        changeDescriptionOfMyDisplayShowed(true);
      }}>
      <Text style={styles.text}>
        あなたは現在他のユーザーに表示されません。
        {'\n'}
        {'\n'}
        表示させたい場合は右上のメニューから
        <Text style={styles.textBold}>
          「自分の表示」→ 「他のユーザーに自分を表示」
        </Text>
        の設定をオンにしてください。
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

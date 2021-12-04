import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useDescriptionOfVideoCallingSettings} from '~/hooks/experiences';
import {AlertMarkModal} from '~/components/utils/AlertMarkModal';

export const DescriptionModal = () => {
  const {
    descriptionOfVideoCallingSettings,
    setDescriptionOfVideoCallingSettings,
    changeDescriptionOfVideoCallingSettings,
  } = useDescriptionOfVideoCallingSettings();

  return (
    <AlertMarkModal
      isVisible={!descriptionOfVideoCallingSettings}
      closeButtonPress={() => {
        setDescriptionOfVideoCallingSettings(true);
        changeDescriptionOfVideoCallingSettings(true);
      }}>
      <Text style={styles.text}>
        相手ユーザーが設定で
        <Text style={styles.textBold}>「ビデオ通話を受け取る」</Text>
        をOFFにしている場合、
        <Text style={styles.textUnderColor}>
          このビデオ通話は相手に知らされず繋がりません。
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
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contents: {
    width: '90%',
    backgroundColor: 'white',
    paddingBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    transform: [{translateX: -11}, {translateY: -11}],
  },
  alert: {
    width: 110,
    height: 110,
    alignSelf: 'center',
  },
  textContainer: {
    marginTop: 10,
    paddingHorizontal: 12,
  },
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

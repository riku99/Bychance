import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Modal from 'react-native-modal';
import {useVideoCallingAlertModalVisible} from '~/hooks/appState';
import {ModalCloseButton} from '~/components/utils/ModalCloseButton';
import LottieView from 'lottie-react-native';

const Alert = require('~/assets/lottie/alert.json');

type Props = {
  isVisible: boolean;
};

export const DescriptionModal = () => {
  const [v, setV] = useState(true);
  return (
    <Modal isVisible={v} style={styles.modalContainer}>
      <View style={styles.contents}>
        <ModalCloseButton
          containerStyle={styles.closeButton}
          onPress={() => {
            setV(false);
          }}
        />
        <LottieView source={Alert} autoPlay style={styles.alert} loop={false} />
        <View style={styles.textContainer}>
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
            <Text style={styles.textSub}>
              ※ 今後このお知らせは表示されません
            </Text>
          </Text>
        </View>
      </View>
    </Modal>
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
    width: 120,
    height: 120,
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

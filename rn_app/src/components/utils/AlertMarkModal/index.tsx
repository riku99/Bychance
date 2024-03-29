import React from 'react';
import {StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
const Alert = require('~/assets/lottie/alert.json');
import {ModalWithTopAsset} from '~/components/utils/ModalWithTopAsset';

type Props = {
  isVisible: boolean;
  closeButtonPress: () => void;
  children: JSX.Element;
};

export const AlertMarkModal = ({
  isVisible,
  closeButtonPress,
  children,
}: Props) => {
  return (
    <ModalWithTopAsset
      isVisible={isVisible}
      closeButtonPress={closeButtonPress}
      topView={
        <LottieView source={Alert} autoPlay style={styles.alert} loop={false} />
      }>
      {children}
    </ModalWithTopAsset>
  );
};

const styles = StyleSheet.create({
  container: {
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
  mainContainer: {
    marginTop: 10,
    paddingHorizontal: 12,
  },
});

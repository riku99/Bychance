import React from 'react';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import {ModalCloseButton} from '~/components/utils/ModalCloseButton';

type Props = {
  isVisible: boolean;
  closeButtonPress: () => void;
  children: JSX.Element;
  topView: JSX.Element;
};

export const ModalWithTopAsset = ({
  isVisible,
  closeButtonPress,
  children,
  topView,
}: Props) => {
  return (
    <Modal isVisible={isVisible} style={styles.container}>
      <View style={styles.contents}>
        <ModalCloseButton
          containerStyle={styles.closeButton}
          onPress={closeButtonPress}
        />
        {topView}
        <View style={styles.mainContainer}>{children}</View>
      </View>
    </Modal>
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

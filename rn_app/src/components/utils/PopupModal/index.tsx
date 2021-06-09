import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import Modal from 'react-native-modal';

type Props = {
  children: Element;
  isVisible: boolean;
  closeModal: () => void;
};

export const CustomPopupModal = React.memo(
  ({children, isVisible, closeModal}: Props) => {
    return (
      <Modal
        isVisible={isVisible}
        onBackdropPress={closeModal}
        swipeDirection="down"
        onSwipeComplete={closeModal}>
        <>
          <View>{children}</View>
          <Button
            title="閉じる"
            titleStyle={styles.buttonTitle}
            buttonStyle={styles.button}
            containerStyle={styles.buttonContainer}
            onPress={closeModal}
          />
        </>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  buttonTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#039dfc',
  },
  button: {
    width: 60,
    height: 30,
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    transform: [{translateY: -40}, {translateX: -30}],
    alignSelf: 'flex-end',
  },
});

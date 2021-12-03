import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import {useVideoCallingAlertModalVisible} from '~/hooks/appState';
import {ModalCloseButton} from '~/components/utils/ModalCloseButton';

type Props = {
  isVisible: boolean;
};

export const VideoCallingAlertModal = () => {
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
    height: 450,
    backgroundColor: 'white',
  },
  closeButton: {
    transform: [{translateX: -11}, {translateY: -11}],
  },
});

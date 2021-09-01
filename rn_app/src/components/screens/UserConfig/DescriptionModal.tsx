import React from 'react';
import {View} from 'react-native';
import Modal from 'react-native-modal';

type Props = {
  isVisible: boolean;
  description: JSX.Element;
};

export const DescriptionModal = React.memo(
  ({isVisible, description}: Props) => {
    return (
      <Modal isVisible={isVisible} onBackdropPress={() => {}}>
        <View
          style={{
            width: '85%',
            height: 100,
            backgroundColor: 'white',
            alignSelf: 'center',
          }}></View>
      </Modal>
    );
  },
);

import React from 'react';
import {Dimensions, Text, View} from 'react-native';
import {Modalize} from 'react-native-modalize';

import {commonModalStyles} from './common';

type Props = {
  modalRef: React.MutableRefObject<Modalize | null>;
};

export const AboutPrivateTimeModal = React.memo(({modalRef}: Props) => {
  return (
    <Modalize ref={modalRef} modalHeight={height * 0.8}>
      <View style={commonModalStyles.modalContainer}>
        <Text style={commonModalStyles.title}>プライベートタイムとは</Text>
        <Text style={commonModalStyles.explanation}>hello</Text>
      </View>
    </Modalize>
  );
});

const {height} = Dimensions.get('screen');

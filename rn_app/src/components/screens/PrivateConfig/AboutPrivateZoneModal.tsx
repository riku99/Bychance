import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {Modalize} from 'react-native-modalize';

type Props = {
  modalRef: React.MutableRefObject<Modalize | null>;
};

export const AboutPrivateZoneModal = React.memo(({modalRef}: Props) => {
  return <Modalize ref={modalRef} modalHeight={height * 0.8} />;
});

const {height} = Dimensions.get('screen');

const styles = StyleSheet.create({});

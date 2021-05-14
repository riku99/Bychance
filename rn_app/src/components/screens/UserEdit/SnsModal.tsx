import React, {useRef, useEffect} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {Modalize} from 'react-native-modalize';

import {SnsList} from '~/types';

type Props = {
  show: SnsList;
  onClose: () => void;
};

export const SnsModal = React.memo(({show, onClose}: Props) => {
  const modalRef = useRef<Modalize>(null);

  useEffect(() => {
    if (show && modalRef.current) {
      modalRef.current.open();
    }
  }, [show]);

  return (
    <Modalize
      ref={modalRef}
      onClose={onClose}
      modalHeight={height / 1.5}></Modalize>
  );
});

const {height} = Dimensions.get('screen');

const styles = StyleSheet.create({});

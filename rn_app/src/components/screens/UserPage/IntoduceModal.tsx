import React, {useEffect, useRef} from 'react';
import {Text, Dimensions, View, StyleSheet} from 'react-native';
import {Modalize} from 'react-native-modalize';

import {oneIntroduceTextLineHeght} from './index';

type Props = {
  show: boolean;
  introduce: string;
  onClose: () => void;
};

export const IntroduceModal = ({show, introduce, onClose}: Props) => {
  const modalRef = useRef<Modalize>(null);

  useEffect(() => {
    if (show && modalRef.current) {
      modalRef.current.open();
    }
  }, [show]);

  return (
    <Modalize ref={modalRef} onClose={onClose} modalHeight={height / 2}>
      <View style={styles.textContainer}>
        <Text style={{lineHeight: oneIntroduceTextLineHeght}}>{introduce}</Text>
      </View>
    </Modalize>
  );
};

const {height} = Dimensions.get('screen');

const styles = StyleSheet.create({
  textContainer: {
    paddingHorizontal: 10,
    marginTop: 15,
  },
});

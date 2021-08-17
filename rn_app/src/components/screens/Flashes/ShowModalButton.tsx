import React from 'react';
import {Animated} from 'react-native';
import {Button} from 'react-native-elements';
import {Modalize} from 'react-native-modalize';

type Props = {
  modalizeRef: React.RefObject<Modalize>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  currentProgressBar: React.MutableRefObject<number>;
  progressAnim: {
    [key: number]: Animated.Value;
  };
};

export const ShowModalButton = ({
  modalizeRef,
  setShowModal,
  setIsPaused,
  currentProgressBar,
  progressAnim,
}: Props) => {
  return (
    <Button
      title="..."
      titleStyle={{fontSize: 30}}
      buttonStyle={{backgroundColor: 'transparent'}}
      activeOpacity={1}
      onPress={() => {
        modalizeRef.current?.open();
        setShowModal(true);
        setIsPaused(true);
        progressAnim[currentProgressBar.current].stopAnimation();
      }}
    />
  );
};

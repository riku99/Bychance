import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {ModalWithTopAsset} from '~/components/utils/ModalWithTopAsset';

type Props = {
  isVisible: boolean;
  closeButtonPress: () => void;
  children: JSX.Element;
  sources: any[];
};

export const PeepsModal = ({
  isVisible,
  closeButtonPress,
  children,
  sources,
}: Props) => {
  return (
    <ModalWithTopAsset
      isVisible={isVisible}
      closeButtonPress={closeButtonPress}
      topView={
        <View style={styles.topContainer}>
          {sources.map((s, idx) => (
            <Image
              source={s}
              width={IMAGE_SIZE}
              height={IMAGE_SIZE}
              style={styles.image}
              key={idx}
            />
          ))}
        </View>
      }>
      {children}
    </ModalWithTopAsset>
  );
};

const IMAGE_SIZE = 70;

const styles = StyleSheet.create({
  topContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    width: '70%',
    justifyContent: 'space-evenly',
    marginBottom: 10,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
});

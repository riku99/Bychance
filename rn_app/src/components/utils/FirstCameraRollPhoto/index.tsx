import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, ImageBackground} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';

import {normalStyles} from '~/constants/styles';

type Props = {
  onPress: () => void;
};

export const FirstCameraRollPhoto = React.memo(({onPress}: Props) => {
  const [firstCameraRollPhoto, setFirstCameraRollPhoto] = useState<string>();

  useEffect(() => {
    const getPhoto = async () => {
      const photo = await CameraRoll.getPhotos({first: 1});
      setFirstCameraRollPhoto(photo.edges[0].node.image.uri);
    };
    getPhoto();
  }, []);

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      onPress={onPress}>
      {firstCameraRollPhoto && (
        <ImageBackground
          source={{uri: firstCameraRollPhoto}}
          style={styles.imageContainer}
          imageStyle={styles.image}
        />
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: normalStyles.imageBackGroundColor,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  image: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
});

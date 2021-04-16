import React, {useMemo} from 'react';
import {Dimensions, StyleSheet, View, ViewStyle} from 'react-native';
import {Button} from 'react-native-elements';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import FIcon from 'react-native-vector-icons/FontAwesome';

type Props = {
  recordingVideo: boolean;
  onPhotoButtonPress: () => void;
  onVideoButtonPress: () => void;
};

export const ShootButtonGroup = ({
  recordingVideo,
  onPhotoButtonPress,
  onVideoButtonPress,
}: Props) => {
  const containerFlexStyle: ViewStyle = useMemo(
    () => ({
      justifyContent: !recordingVideo ? 'space-between' : 'center',
    }),
    [recordingVideo],
  );

  return (
    <View style={[styles.container, containerFlexStyle]}>
      {!recordingVideo && (
        <Button
          icon={
            <MIcon
              name="enhance-photo-translate"
              size={25}
              style={{color: 'white'}}
            />
          }
          buttonStyle={styles.shootButton}
          onPress={onPhotoButtonPress}
        />
      )}
      <Button
        icon={
          recordingVideo ? (
            <FIcon name="square" style={{color: 'red'}} size={25} />
          ) : (
            <MIcon name="video-call" size={25} style={{color: 'white'}} />
          )
        }
        buttonStyle={styles.shootButton}
        onPress={onVideoButtonPress}
      />
    </View>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  shootButton: {
    width: width / 6,
    height: width / 6,
    borderRadius: width / 6,
    borderColor: 'white',
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
});

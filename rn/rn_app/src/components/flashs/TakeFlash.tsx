import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  LayoutAnimation,
  ViewStyle,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Button} from 'react-native-elements';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import FIcon from 'react-native-vector-icons/FontAwesome';

type Props = {goBack: () => void};

export const TakeFlash = ({goBack}: Props) => {
  const [recordingVideo, setRecordingVideo] = useState(false);
  const [backPhotoMode, setBackPhotoMode] = useState(true);
  const [isShooted, setIsShooted] = useState(false);

  const shootButtonFlexstyle: ViewStyle = {
    justifyContent: !recordingVideo ? 'space-evenly' : 'center',
  };

  const cameraRef = useRef<RNCamera>(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = {quality: 0.9, base64: true};
      const data = await cameraRef.current.takePictureAsync(options);
      console.log(data);
    }
  };

  const takeVideo = async () => {
    if (cameraRef.current) {
      const options = {quality: RNCamera.Constants.VideoQuality['1080p']};
      const data = await cameraRef.current.recordAsync(options);
    }
  };
  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={
          backPhotoMode
            ? RNCamera.Constants.Type.back
            : RNCamera.Constants.Type.front
        }
      />
      <Button
        icon={
          <MIcon name={'chevron-right'} style={{color: 'white'}} size={35} />
        }
        containerStyle={styles.backButtonContainer}
        buttonStyle={styles.backButton}
        onPress={goBack}
      />
      <Button
        icon={<MIcon name="party-mode" style={{color: 'white'}} size={25} />}
        containerStyle={styles.changePhotoModeButtonContainer}
        buttonStyle={styles.changePhotoModeButton}
        onPress={() => {
          backPhotoMode ? setBackPhotoMode(false) : setBackPhotoMode(true);
        }}
      />
      <View style={{...styles.shootButtonBox, ...shootButtonFlexstyle}}>
        {!recordingVideo && (
          <Button
            icon={
              <MIcon
                name="enhance-photo-translate"
                size={20}
                style={{color: 'white'}}
              />
            }
            buttonStyle={styles.shootButton}
            onPress={takePicture}
          />
        )}
        <Button
          icon={
            recordingVideo ? (
              <FIcon name="square" style={{color: 'red'}} size={25} />
            ) : (
              <MIcon name="video-call" size={20} style={{color: 'white'}} />
            )
          }
          buttonStyle={styles.shootButton}
          onPress={() => {
            LayoutAnimation.easeInEaseOut();
            setRecordingVideo(true);
          }}
        />
      </View>
    </View>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  changePhotoModeButtonContainer: {
    width: '15%',
    position: 'absolute',
    top: '8%',
    left: '5%',
  },
  changePhotoModeButton: {
    backgroundColor: 'transparent',
  },
  backButtonContainer: {
    width: '13%',
    position: 'absolute',
    top: '8%',
    right: '5%',
  },
  backButton: {
    backgroundColor: 'transparent',
  },
  shootButtonBox: {
    width: '80%',
    height: '8%',
    position: 'absolute',
    bottom: '5%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  shootButton: {
    width: width / 7,
    height: width / 7,
    borderRadius: width / 7,
    borderColor: 'white',
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
});

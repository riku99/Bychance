import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  LayoutAnimation,
  ViewStyle,
  Image,
  ActivityIndicator,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Button} from 'react-native-elements';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import FIcon from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';

import {flashMessage} from '../../helpers/flashMessage';

type Props = {
  goBack: () => void;
  saveDataToCameraRoll: (uri: string) => Promise<void>;
};

export const TakeFlash = ({goBack, saveDataToCameraRoll}: Props) => {
  const [backPhotoMode, setBackPhotoMode] = useState(true);
  const [takenPhoto, setTakenPhoto] = useState<{
    base64: string;
    uri: string;
  } | null>(null);
  const [takenVideo, setTakenVideo] = useState<string | null>(null);
  const [recordingVideo, setRecordingVideo] = useState(false);
  const [savingData, setSavingData] = useState(false);

  const shootButtonFlexstyle: ViewStyle = {
    justifyContent: !recordingVideo ? 'space-evenly' : 'center',
  };

  const cameraRef = useRef<RNCamera>(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = {quality: 1, base64: true};
      const data = await cameraRef.current.takePictureAsync(options);
      if (data && data.base64) {
        setTakenPhoto({base64: data.base64, uri: data.uri});
      }
    }
  };

  const takeVideo = async () => {
    if (cameraRef.current) {
      const options = {quality: RNCamera.Constants.VideoQuality['1080p']};
      const data = await cameraRef.current.recordAsync(options);
      setTakenVideo(data.uri);
    }
  };

  const stopVideo = () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
  };

  return (
    <View style={styles.container}>
      {!takenPhoto && !takenVideo ? (
        <>
          <RNCamera
            ref={cameraRef}
            style={styles.preview}
            type={
              backPhotoMode
                ? RNCamera.Constants.Type.back
                : RNCamera.Constants.Type.front
            }
            keepAudioSession={true}
          />
          <Button
            icon={
              <MIcon
                name={'chevron-right'}
                style={{color: 'white'}}
                size={35}
              />
            }
            containerStyle={styles.backButtonContainer}
            buttonStyle={styles.backButton}
            onPress={goBack}
          />
          <Button
            icon={
              <MIcon name="party-mode" style={{color: 'white'}} size={25} />
            }
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
                if (!recordingVideo) {
                  LayoutAnimation.easeInEaseOut();
                  setRecordingVideo(true);
                  takeVideo();
                } else {
                  stopVideo();
                  setRecordingVideo(false);
                }
              }}
            />
          </View>
        </>
      ) : (
        <>
          {takenPhoto && !takenVideo && !recordingVideo ? (
            <>
              <Image
                source={{uri: 'data:image/jpeg;base64,' + takenPhoto.base64}}
                style={{width: '100%', height: '100%'}}
              />
            </>
          ) : (
            !takenPhoto &&
            !recordingVideo &&
            takenVideo && (
              <>
                <Video
                  source={{uri: takenVideo}}
                  style={styles.backGroundVideo}
                  repeat={true}
                />
              </>
            )
          )}
          <View style={styles.saveDataContainer}>
            <Button
              icon={
                <MIcon name="save-alt" style={{color: 'white'}} size={40} />
              }
              buttonStyle={styles.saveDataButton}
              onPress={async () => {
                setSavingData(true);
                if (takenPhoto) {
                  await saveDataToCameraRoll(takenPhoto.uri);
                  setSavingData(false);
                  flashMessage('保存しました', 'success');
                } else if (takenVideo) {
                  saveDataToCameraRoll(takenVideo);
                  setSavingData(true);
                }
              }}
              disabled={savingData}
              disabledStyle={{backgroundColor: 'transparent'}}
            />
            <Text style={styles.saveDataText}>フォルダに保存</Text>
          </View>
          <View style={styles.addFlashContaienr}>
            <Button
              icon={
                <MIcon
                  name="add-circle-outline"
                  style={{color: 'white'}}
                  size={40}
                />
              }
              buttonStyle={styles.addFlashButton}
            />
            <Text style={styles.addFlashText}>フラッシュに追加</Text>
          </View>
          <Button
            icon={
              <MIcon
                name={'chevron-right'}
                style={{color: 'white'}}
                size={35}
              />
            }
            containerStyle={styles.backButtonContainer}
            buttonStyle={styles.backButton}
            onPress={goBack}
          />
          {savingData && (
            <ActivityIndicator style={styles.load} color="white" />
          )}
        </>
      )}
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
  backGroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  saveDataContainer: {
    position: 'absolute',
    bottom: '3%',
    right: '10%',
  },
  saveDataButton: {
    backgroundColor: 'transparent',
  },
  saveDataText: {
    fontWeight: 'bold',
    color: 'white',
  },
  addFlashContaienr: {
    position: 'absolute',
    bottom: '3%',
    left: '10%',
  },
  addFlashButton: {
    backgroundColor: 'transparent',
  },
  addFlashText: {
    color: 'white',
    fontWeight: 'bold',
  },
  load: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

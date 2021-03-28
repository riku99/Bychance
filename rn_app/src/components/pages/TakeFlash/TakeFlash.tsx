import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  LayoutAnimation,
  ViewStyle,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Button} from 'react-native-elements';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import FIcon from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';

import {displayShortMessage} from '../../../helpers/shortMessages/displayShortMessage';

type Props = {
  cameraRef: React.RefObject<RNCamera>;
  targetPhoto: {
    base64: string;
    uri: string;
  } | null;
  targetVideo: {
    uri: string;
  } | null;
  firstCameraRollPhoto: string | null;
  takePhoto: () => Promise<void>;
  takeVideo: () => Promise<void>;
  stopVideo: () => void;
  goBack: () => void;
  saveDataToCameraRoll: (uri: string) => Promise<void>;
  createFlash: ({
    source,
    sourceType,
    uri,
  }: {
    source?: string;
    sourceType: 'image' | 'video';
    uri: string;
  }) => Promise<void>;
  pickImageOrVideo: () => void;
  recordingVideo: boolean;
  setRecordingVideo: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TakeFlash = React.memo(
  ({
    cameraRef,
    targetPhoto,
    targetVideo,
    firstCameraRollPhoto,
    takePhoto,
    takeVideo,
    stopVideo,
    goBack,
    saveDataToCameraRoll,
    createFlash,
    pickImageOrVideo,
    recordingVideo,
    setRecordingVideo,
  }: Props) => {
    const [backPhotoMode, setBackPhotoMode] = useState(true);
    const [savingData, setSavingData] = useState(false);

    const shootButtonFlexstyle: ViewStyle = {
      justifyContent: !recordingVideo ? 'space-evenly' : 'center',
    };

    return (
      <View style={styles.container}>
        {!targetPhoto && !targetVideo ? (
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
                  size={45}
                />
              }
              containerStyle={styles.backButtonContainer}
              buttonStyle={styles.backButton}
              onPress={goBack}
            />
            <Button
              icon={
                <MIcon name="party-mode" style={{color: 'white'}} size={35} />
              }
              containerStyle={styles.changePhotoModeButtonContainer}
              buttonStyle={styles.changePhotoModeButton}
              onPress={() => {
                backPhotoMode
                  ? setBackPhotoMode(false)
                  : setBackPhotoMode(true);
              }}
            />
            <View style={{...styles.shootButtonBox, ...shootButtonFlexstyle}}>
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
                  onPress={takePhoto}
                />
              )}
              <Button
                icon={
                  recordingVideo ? (
                    <FIcon name="square" style={{color: 'red'}} size={25} />
                  ) : (
                    <MIcon
                      name="video-call"
                      size={25}
                      style={{color: 'white'}}
                    />
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
            <TouchableOpacity
              style={styles.accessCamerarollContainer}
              activeOpacity={1}
              onPress={() => {
                pickImageOrVideo();
              }}>
              {firstCameraRollPhoto && (
                <ImageBackground
                  source={{uri: firstCameraRollPhoto}}
                  style={{
                    width: styles.accessCamerarollContainer.width,
                    height: styles.accessCamerarollContainer.height,
                  }}
                  imageStyle={styles.accessCamerarollImage}
                />
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            {targetPhoto && !targetVideo && !recordingVideo ? (
              <></>
            ) : (
              !targetPhoto &&
              !recordingVideo &&
              targetVideo && (
                <>
                  <Video
                    source={{
                      uri: targetVideo.uri,
                    }}
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
                  if (targetPhoto) {
                    await saveDataToCameraRoll(targetPhoto.uri);
                  } else if (targetVideo) {
                    await saveDataToCameraRoll(targetVideo.uri);
                  }
                  setSavingData(false);
                  displayShortMessage('保存しました', 'success');
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
                onPress={() => {
                  if (targetPhoto) {
                    createFlash({
                      source: targetPhoto.base64,
                      sourceType: 'image',
                      uri: targetPhoto.uri,
                    });
                  } else if (targetVideo) {
                    createFlash({sourceType: 'video', uri: targetVideo.uri});
                  }
                }}
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
  },
);

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
    top: '9%',
    left: 27,
  },
  changePhotoModeButton: {
    backgroundColor: 'transparent',
  },
  backButtonContainer: {
    width: '13%',
    position: 'absolute',
    top: '9%',
    right: '5%',
  },
  backButton: {
    backgroundColor: 'transparent',
  },
  accessCamerarollContainer: {
    position: 'absolute',
    bottom: '3%',
    left: 25,
    width: 35,
    height: 35,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
  },
  accessCamerarollImage: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
  shootButtonBox: {
    width: '80%',
    height: '10%',
    position: 'absolute',
    bottom: '8%',
    alignSelf: 'center',
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

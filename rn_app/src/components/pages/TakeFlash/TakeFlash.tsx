import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  LayoutAnimation,
  ActivityIndicator,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Button} from 'react-native-elements';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {displayShortMessage} from '../../../helpers/shortMessages/displayShortMessage';
import {FirstCameraRollPhoto} from '~/components/utils/FirstCameraRollPhoto';
import {TakeFlashTopButtonGroup} from './TakeFlashTopButtonGroup';
import {ShootButtonGroup} from './ShootButtonGroup';

type Props = {
  cameraRef: React.RefObject<RNCamera>;
  targetPhoto: {
    base64: string;
    uri: string;
  } | null;
  targetVideo: {
    uri: string;
  } | null;
  takePhoto: () => Promise<void>;
  takeVideo: () => Promise<void>;
  stopVideo: () => void;
  saveDataToCameraRoll: (uri: string) => Promise<void>;
  pickImageOrVideo: () => void;
  recordingVideo: boolean;
  setRecordingVideo: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TakeFlash = React.memo(
  ({
    cameraRef,
    targetPhoto,
    targetVideo,
    takePhoto,
    takeVideo,
    stopVideo,
    saveDataToCameraRoll,
    pickImageOrVideo,
    recordingVideo,
    setRecordingVideo,
  }: Props) => {
    const [backPhotoMode, setBackPhotoMode] = useState(true);
    const [savingData, setSavingData] = useState(false);

    const {top, bottom} = useSafeAreaInsets();

    const onPartyModePress = () => {
      backPhotoMode ? setBackPhotoMode(false) : setBackPhotoMode(true);
    };

    const onVideoButtonPress = () => {
      if (!recordingVideo) {
        LayoutAnimation.easeInEaseOut();
        setRecordingVideo(true);
        takeVideo();
      } else {
        stopVideo();
        setRecordingVideo(false);
      }
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
            <View style={[styles.topButtonGroupContainer, {top}]}>
              <TakeFlashTopButtonGroup onPartyModePress={onPartyModePress} />
            </View>
            <View style={styles.shootButtonContainer}>
              <ShootButtonGroup
                recordingVideo={recordingVideo}
                onPhotoButtonPress={takePhoto}
                onVideoButtonPress={onVideoButtonPress}
              />
            </View>
            <View style={[styles.firstPhotoContainer, {bottom: bottom + 10}]}>
              <FirstCameraRollPhoto onPress={pickImageOrVideo} />
            </View>
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
              />
              <Text style={styles.addFlashText}>フラッシュに追加</Text>
            </View>
            {/* <Button
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
            /> */}
            {savingData && (
              <ActivityIndicator style={styles.load} color="white" />
            )}
          </>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  topButtonGroupContainer: {
    position: 'absolute',
    width: '90%',
    alignSelf: 'center',
  },
  firstPhotoContainer: {
    position: 'absolute',
    left: '4%',
    height: 38,
    width: 38,
  },
  shootButtonContainer: {
    width: '55%',
    height: '10%',
    position: 'absolute',
    bottom: '8%',
    alignSelf: 'center',
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

import React, {useState, useMemo, useLayoutEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  LayoutAnimation,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Button} from 'react-native-elements';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {FirstCameraRollPhoto} from '~/components/utils/FirstCameraRollPhoto';
import {ShootButtonGroup} from './ShootButtonGroup';
import {useMoreDeviceX} from '~/hooks/device/';
import {BackButton} from '~/components/utils/BackButton';

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
  loading: boolean;
  onPictureTaken: () => void;
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
    onPictureTaken,
    loading,
  }: Props) => {
    const [backPhotoMode, setBackPhotoMode] = useState(true);

    const {top, bottom} = useSafeAreaInsets();
    const moreDeviceX = useMoreDeviceX(); // これhooksにしない方が便利
    const cameraBorderRadius = useMemo(() => (moreDeviceX ? 20 : 0), [
      moreDeviceX,
    ]);

    useLayoutEffect(() => {
      StatusBar.setBarStyle('light-content');
      StatusBar.setHidden(!moreDeviceX ? true : false);

      return () => {
        StatusBar.setHidden(false);
        StatusBar.setBarStyle('default');
      };
    }, [moreDeviceX]);

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
            <View
              style={[
                styles.preview,
                {marginTop: top, borderRadius: cameraBorderRadius},
              ]}>
              <RNCamera
                ref={cameraRef}
                style={styles.camera}
                type={
                  backPhotoMode
                    ? RNCamera.Constants.Type.back
                    : RNCamera.Constants.Type.front
                }
                keepAudioSession={true}
                onPictureTaken={onPictureTaken}
              />
            </View>
            <View style={[styles.topButtonGroupContainer, {top: top + 15}]}>
              <BackButton
                icon={{name: 'chevron-right', size: 35, color: 'white'}}
                buttonStyle={{backgroundColor: 'transoarent'}}
                containerStyle={{alignSelf: 'flex-end'}}
                onPress={onPartyModePress}
              />
            </View>
            <View style={styles.shootButtonContainer}>
              <ShootButtonGroup
                recordingVideo={recordingVideo}
                onPhotoButtonPress={takePhoto}
                onVideoButtonPress={onVideoButtonPress}
              />
            </View>
            <View style={[styles.bottomButtonGroupContainer, {bottom}]}>
              <View style={[styles.firstPhotoContainer]}>
                <FirstCameraRollPhoto onPress={pickImageOrVideo} />
              </View>
              <Button
                icon={
                  <MIcon
                    name="party-mode"
                    style={{color: 'white'}}
                    size={35}
                    onPress={() => setBackPhotoMode((b) => !b)}
                  />
                }
                buttonStyle={{backgroundColor: 'transparent'}}
              />
            </View>
          </>
        ) : (
          <>
            {targetPhoto && !targetVideo && !recordingVideo ? (
              <></>
            ) : (
              <></>
              // !targetPhoto &&
              // !recordingVideo &&
              // targetVideo && (
              //   <>
              //     <Video
              //       source={{
              //         uri: targetVideo.uri,
              //       }}
              //       style={styles.backGroundVideo}
              //       repeat={true}
              //     />
              //   </>
              // )
            )}
            {/* <View style={styles.saveDataContainer}>
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
            </View> */}
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
          </>
        )}
        {loading && (
          <View style={styles.load}>
            <Text style={styles.loadText}>ロード中です</Text>
            <ActivityIndicator color="white" />
          </View>
        )}
      </View>
    );
  },
);

const {width} = Dimensions.get('screen');

const loadToastStyle = {height: 35, width: 135};

const partsWidth = width / 9;
const sourceHeight = partsWidth * 16;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  preview: {
    width,
    height: sourceHeight,
    overflow: 'hidden',
  },
  camera: {
    width,
    height: sourceHeight,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  topButtonGroupContainer: {
    position: 'absolute',
    width: '90%',
    alignSelf: 'center',
  },
  bottomButtonGroupContainer: {
    flexDirection: 'row',
    width: '93%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
  },
  firstPhotoContainer: {
    height: 38,
    width: 38,
  },
  shootButtonContainer: {
    width: '55%',
    height: '10%',
    position: 'absolute',
    bottom: '13%',
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
    top: '50%',
    left: '50%',
    transform: [
      {translateX: -(loadToastStyle.width / 2)},
      {translateY: -(loadToastStyle.height / 2)},
    ],
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: loadToastStyle.width,
    height: loadToastStyle.height,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 10,
  },
  loadText: {
    color: 'white',
    marginRight: 4,
    fontWeight: '500',
  },
});

import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  LayoutAnimation,
  ActivityIndicator,
  Animated,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Button} from 'react-native-elements';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';

import {FirstCameraRollPhoto} from '~/components/utils/FirstCameraRollPhoto';
import {ShootButtonGroup} from './ShootButtonGroup';
import {BackButton} from '~/components/utils/BackButton';
import {WideRangeSourceContainer} from '~/components/utils/WideRangeSourceContainer';
import {useFlashStatusBarSetting} from '~/hooks/statusBar';

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
  pickImageOrVideo: () => void;
  recordingVideo: boolean;
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
    pickImageOrVideo,
    recordingVideo,
    onPictureTaken,
    loading,
  }: Props) => {
    const [backPhotoMode, setBackPhotoMode] = useState(true);

    const {top, bottom} = useSafeAreaInsets();

    useFlashStatusBarSetting();

    const changePhotoMode = () => {
      backPhotoMode ? setBackPhotoMode(false) : setBackPhotoMode(true);
    };

    const onVideoButtonPress = () => {
      if (!recordingVideo) {
        LayoutAnimation.easeInEaseOut();
        takeVideo();
      } else {
        stopVideo();
      }
    };

    return (
      <View style={styles.container}>
        {!targetPhoto && !targetVideo ? (
          <>
            <WideRangeSourceContainer>
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
            </WideRangeSourceContainer>
            <View style={[styles.topButtonGroupContainer, {top: top + 15}]}>
              <BackButton
                icon={{name: 'chevron-right', size: 35, color: 'white'}}
                buttonStyle={{backgroundColor: 'transoarent'}}
                containerStyle={{alignSelf: 'flex-end'}}
                onPress={changePhotoMode}
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

        {recordingVideo && (
          <View style={styles.timerContainer}>
            <CountdownCircleTimer
              isPlaying
              duration={15}
              size={70}
              strokeWidth={6}
              isLinearGradient
              colors={[
                ['#ff9791', 0.5],
                ['#f7b57c', 0.5],
              ]}>
              {({remainingTime, animatedColor}) => (
                <Animated.Text
                  style={[styles.timerText, {color: animatedColor}]}>
                  {remainingTime}
                </Animated.Text>
              )}
            </CountdownCircleTimer>
          </View>
        )}
      </View>
    );
  },
);

const loadToastStyle = {height: 35, width: 135};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // backgroundのみopacityをかけたい場合はrgbaでbackgroundColorを指定する。opacityで指定すると子要素まで透明になる
    borderRadius: 10,
  },
  loadText: {
    color: 'white',
    marginRight: 4,
    fontWeight: '500',
  },
  timerContainer: {
    position: 'absolute',
    bottom: '13%',
    left: '8%',
  },
  timerText: {
    fontSize: 19,
  },
});

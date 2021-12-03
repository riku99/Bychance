import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';
import Config from 'react-native-config';
import {Button} from 'react-native-elements';
import {CallEndButton} from '~/components/utils/CallEndButon';
import {useVideoCalling} from '~/hooks/appState';
import {useSafeArea} from '~/hooks/appState';
import {WaveIndicator} from 'react-native-indicators';
import {useVideoCallingState} from '~/hooks/videoCalling';
import {DescriptionModal} from './DescriptionModal';

export const VideoCalling = React.memo(() => {
  // const [engine, setEngine] = useState<RtcEngine>();
  // const [peerId, setpeerId] = useState<number>();
  // const [joinSucceed, setJoinSuccees] = useState(false);
  // const {setVideoCalling} = useVideoCalling();
  // const [enableVideo, setEnableVideo] = useState(true);
  // const {top} = useSafeArea();
  // const {videoCallingState, setVideoCallingState} = useVideoCallingState();
  // const {uid, token, channelName} = videoCallingState;

  // const onCallEndButtonPress = async () => {
  //   await engine?.leaveChannel();
  //   setJoinSuccees(false);
  //   setVideoCalling(false);
  // };

  // const onVideocamBurttonPress = () => {
  //   if (enableVideo) {
  //     engine?.enableLocalVideo(false);
  //     setEnableVideo(false);
  //   } else {
  //     engine?.enableLocalVideo(true);
  //     setEnableVideo(true);
  //   }
  // };

  // const onSwitchCameraButtonPress = async () => {
  //   await engine?.switchCamera();
  // };

  // useEffect(() => {
  //   (async function () {
  //     const engineResult = await RtcEngine.create(Config.AGORA_APP_ID);
  //     setEngine(engineResult);
  //   })();
  // }, []);

  // useEffect(() => {
  //   (async function () {
  //     await engine?.enableVideo();
  //   })();

  //   const success = () => {
  //     console.log('✋ JoinChannelSuccess');
  //     setJoinSuccees(true);
  //   };
  //   const successSub = engine?.addListener('JoinChannelSuccess', success);

  //   return () => {
  //     successSub?.remove();
  //   };
  // }, [engine]);

  // useEffect(() => {
  //   const joined = (_uid: number, elapsed: number) => {
  //     console.log('😆 User joined', _uid, elapsed);
  //     setpeerId(_uid);
  //   };

  //   const offline = (_uid: number, reason: number) => {
  //     console.log('UserOffline', _uid, reason);
  //     setpeerId(undefined);
  //   };

  //   const joinedSub = engine?.addListener('UserJoined', joined);
  //   const offlineSub = engine?.addListener('UserOffline', offline);

  //   return () => {
  //     joinedSub?.remove();
  //     offlineSub?.remove();
  //   };
  // }, [peerId, engine]);

  // useEffect(() => {
  //   (async function () {
  //     if (engine && channelName && token && uid) {
  //       await engine.joinChannel(token, channelName, null, uid);
  //     }
  //   })();

  //   return () => {
  //     (async function () {
  //       await engine?.leaveChannel();
  //     })();
  //   };
  // }, [engine, token, channelName, uid]);

  // useEffect(() => {
  //   return () => {
  //     setVideoCallingState({uid: null, channelName: null, token: null});
  //   };
  // }, [setVideoCallingState]);

  // const renderOnlyLocalView = useCallback(() => {
  //   return (
  //     <View style={styles.videoView}>
  //       {channelName && (
  //         <RtcLocalView.SurfaceView
  //           style={styles.max}
  //           channelId={channelName}
  //           renderMode={VideoRenderMode.Hidden}
  //         />
  //       )}
  //     </View>
  //   );
  // }, [channelName]);

  // const renderExistPeerView = useCallback(() => {
  //   return (
  //     <View style={styles.videoView}>
  //       {peerId && channelName && (
  //         <RtcRemoteView.SurfaceView
  //           style={styles.max}
  //           zOrderMediaOverlay
  //           channelId={channelName}
  //           uid={peerId}
  //           renderMode={VideoRenderMode.Hidden}>
  //           <View style={[styles.localContainer, {top: top + 5}]}>
  //             <RtcLocalView.SurfaceView
  //               style={styles.local}
  //               channelId={channelName}
  //               renderMode={VideoRenderMode.Hidden}
  //             />
  //           </View>
  //         </RtcRemoteView.SurfaceView>
  //       )}
  //     </View>
  //   );
  // }, [channelName, peerId, top]);

  return (
    <View style={styles.container}>
      {/* {joinSucceed ? (
        <View>
          <>
            {peerId ? renderExistPeerView() : renderOnlyLocalView()}
            <View style={styles.buttonContainer}>
              <Button
                icon={{
                  name: 'flip-camera-ios',
                  color: 'white',
                  size: BUTTON_ICON_SIZE,
                }}
                buttonStyle={styles.videoCam}
                onPress={onSwitchCameraButtonPress}
                activeOpacity={1}
              />
              <CallEndButton onPress={onCallEndButtonPress} buttonSize={64} />
              <Button
                icon={{
                  name: enableVideo ? 'videocam' : 'videocam-off',
                  color: 'white',
                  size: BUTTON_ICON_SIZE,
                }}
                buttonStyle={styles.videoCam}
                onPress={onVideocamBurttonPress}
                activeOpacity={1}
              />
            </View>
          </>
        </View>
      ) : (
        <View style={[styles.loadingView]}>
          <WaveIndicator color="white" size={50} />
        </View>
      )} */}
      <DescriptionModal />
    </View>
  );
});

const {width, height} = Dimensions.get('screen');
const BUTTON_SIZE = 64;
const BUTTON_ICON_SIZE = 28;

const styles = StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor: 'black',
  },
  max: {
    flex: 1,
  },
  videoView: {
    width,
    height,
    backgroundColor: 'black',
  },
  buttonContainer: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: '12%',
    flexDirection: 'row',
    width: 300,
    justifyContent: 'space-between',
  },
  videoCam: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'white',
  },
  localContainer: {
    position: 'absolute',
    width: 110,
    height: 130,
    right: 10,
    backgroundColor: 'black',
  },
  local: {
    width: '100%',
    height: '100%',
  },
  loadingView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    flex: 1,
  },
});

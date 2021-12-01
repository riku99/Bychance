import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';
import Config from 'react-native-config';

type Props = {
  channelName: string;
  token: string;
  uid: number;
};

export const VideoCalling = React.memo(({channelName, token, uid}: Props) => {
  const [engine, setEngine] = useState<RtcEngine>();
  const [peerIds, setPeerIds] = useState<number[]>([]);
  const [joinSucceed, setJoinSuccees] = useState(false);

  useEffect(() => {
    (async function () {
      const engineResult = await RtcEngine.create(Config.AGORA_APP_ID);
      setEngine(engineResult);
    })();
  }, []);

  useEffect(() => {
    (async function () {
      await engine?.enableVideo();
    })();

    const success = () => {
      console.log('✋ JoinChannelSuccess');
      setJoinSuccees(true);
    };
    const successSub = engine?.addListener('JoinChannelSuccess', success);

    return () => {
      successSub?.remove();
    };
  }, [engine]);

  useEffect(() => {
    const joined = (_uid: number, elapsed: number) => {
      console.log('User joined', _uid, elapsed);
      if (peerIds.indexOf(_uid) === -1) {
        setPeerIds((current) => current && [...current, _uid]);
      }
    };

    const offline = (_uid: number, reason: number) => {
      console.log('UserOffline', _uid, reason);
      setPeerIds((current) => current && current.filter((id) => id !== _uid));
    };

    const joinedSub = engine?.addListener('UserJoined', joined);
    const offlineSub = engine?.addListener('UserOffline', offline);

    return () => {
      joinedSub?.remove();
      offlineSub?.remove();
    };
  }, [peerIds, engine]);

  return (
    <View style={styles.container}>
      {joinSucceed && (
        <View style={styles.videoView}>
          {/* <RtcLocalView.SurfaceView
            style={styles.max}
            channelId={channelName}
            renderMode={VideoRenderMode.Hidden}>
            <>
              {peerIds.map((value) => {
                return (
                  <RtcRemoteView.SurfaceView
                    style={styles.remote}
                    uid={value}
                    channelId={channelName}
                    renderMode={VideoRenderMode.Hidden}
                    zOrderMediaOverlay={true}
                  />
                );
              })}
            </>
          </RtcLocalView.SurfaceView> */}
        </View>
      )}
      <TouchableOpacity
        style={{alignSelf: 'center', position: 'absolute', top: 300}}
        onPress={async () => {
          if (joinSucceed) {
            console.log('👀 leave');
            await engine?.leaveChannel();
            setJoinSuccees(false);
            return;
          }
          console.log('👀 press');
          await engine?.joinChannel(token, channelName, null, uid);
        }}>
        <Text>Strat</Text>
      </TouchableOpacity>
    </View>
  );
});

const {width, height} = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    width,
    height,
  },
  max: {
    flex: 1,
  },
  videoView: {
    width,
    height,
    backgroundColor: 'gray',
  },
  remote: {
    width: 150,
    height: 150,
    marginHorizontal: 2.5,
  },
});

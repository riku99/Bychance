import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';

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
      const engineResult = await RtcEngine.create('appId');
      setEngine(engineResult);
    })();
  }, []);

  useEffect(() => {
    (async function () {
      await engine?.enableVideo();
    })();

    const success = (channel: string, _uid: number, elapsed: number) => {
      console.log('JoinChannelSuccess', channel, _uid, elapsed);
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

  useEffect(() => {
    engine?.joinChannel(token, channelName, null, uid);
  }, [engine, token, channelName, uid]);

  return (
    <View style={styles.container}>
      {joinSucceed && (
        <View style={styles.videoView}>
          <RtcLocalView.SurfaceView
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
          </RtcLocalView.SurfaceView>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  max: {
    flex: 1,
  },
  videoView: {
    width: '100%',
    height: '100%',
  },
  remote: {
    width: 150,
    height: 150,
    marginHorizontal: 2.5,
  },
});

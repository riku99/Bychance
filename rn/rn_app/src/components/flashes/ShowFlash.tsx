import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  Dimensions,
  Image,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Button} from 'react-native-elements';
import Video from 'react-native-video';

import {X_HEIGHT} from '../../constants/device';
import {FlashUserInfo} from '../../components/users/UserProfile';
import {UserAvatar} from '../utils/Avatar';
import {Flash} from '../../redux/flashes';

type Props = {
  userInfo: FlashUserInfo;
  flashes: Flash[];
  navigateToGoback: () => void;
};

export const ShowFlash = ({userInfo, flashes, navigateToGoback}: Props) => {
  const progressWidth = useMemo(() => {
    return MAX_PROGRESS_BAR / flashes.length - 1;
  }, [flashes.length]);

  const [currentFlash, setCurrentFlash] = useState(flashes[0]);
  const [onLoading, setOnLoading] = useState(true);

  const firstRender = useRef(false);
  const progressAnim = useRef<{[key: number]: Animated.Value}>({}).current;
  const progressValue = useRef(-progressWidth);
  const currentProgress = useRef(0);
  const longPress = useRef(false);
  const videoDuration = useRef<number | undefined>(undefined);
  const videoStart = useRef(true);

  const progressAnimation = useCallback(
    ({
      progressNumber,
      duration = 5000,
    }: {
      progressNumber: number;
      duration?: number;
    }) => {
      if (progressNumber < flashes.length) {
        progressAnim[progressNumber].addListener((e) => {
          progressValue.current = e.value;
        });
        progressValue.current = -progressWidth;
        Animated.timing(progressAnim[progressNumber], {
          toValue: 0,
          duration: -progressValue.current / (progressWidth / duration),
          useNativeDriver: true,
        }).start((e) => {
          videoDuration.current = undefined;
          if (e.finished) {
            currentProgress.current += 1;
            if (currentProgress.current === flashes.length) {
              return;
            }
            setCurrentFlash(flashes[currentProgress.current]);
          }
        });
      }
    },
    [progressAnim, progressWidth, flashes],
  );

  useEffect(() => {
    firstRender.current = true;
  }, []);

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      delayLongPress={200}
      onPress={() => {
        progressAnim[currentProgress.current].setValue(0);
        if (currentProgress.current < flashes.length - 1) {
          currentProgress.current += 1;
          setCurrentFlash(flashes[currentProgress.current]);
          videoDuration.current = undefined;
        }
      }}
      onLongPress={() => {
        progressAnim[currentProgress.current].stopAnimation();
        longPress.current = true;
      }}
      onPressOut={() => {
        if (longPress.current) {
          progressAnimation({
            progressNumber: currentProgress.current,
            duration: videoDuration.current,
          });
          longPress.current = false;
        }
      }}
      onPressIn={() => {}}>
      <StatusBar hidden={true} />
      {currentFlash.contentType === 'image' ? (
        <View style={styles.imageContainer}>
          <Image
            source={{uri: currentFlash.content}}
            style={{width: '100%', height: '100%'}}
            onLoadStart={() => {
              setOnLoading(true);
            }}
            onLoad={() => {
              setOnLoading(false);
              progressAnimation({progressNumber: currentProgress.current});
            }}
          />
        </View>
      ) : (
        <Video
          source={{uri: currentFlash.content}}
          style={{width: '100%', height: '100%'}}
          onLoadStart={() => {
            setOnLoading(true);
          }}
          onLoad={(e) => {
            videoDuration.current = e.duration * 1000;
          }}
          onProgress={({currentTime}) => {
            setOnLoading(false);
            if (currentTime > 0.002 && videoStart.current) {
              progressAnimation({
                progressNumber: currentProgress.current,
                duration: videoDuration.current,
              });
              videoStart.current = false;
            }
          }}
          onEnd={() => {
            videoStart.current = true;
          }}
        />
      )}

      <View style={styles.info}>
        <View style={styles.progressBarConteiner}>
          {flashes.map((f, i) => {
            if (!firstRender.current) {
              progressAnim[i] = new Animated.Value(-progressWidth);
            }
            return (
              <View
                key={i}
                style={{
                  ...styles.progressBar,
                  width: progressWidth,
                }}>
                <Animated.View
                  style={{
                    ...styles.animatedProgressBar,
                    width: progressWidth,
                    transform: [{translateX: progressAnim[i]}],
                  }}
                />
              </View>
            );
          })}
        </View>
        <View style={styles.infoItems}>
          <View style={styles.userInfo}>
            <UserAvatar image={userInfo.userImage} size="small" opacity={1} />
            <Text style={styles.userName}>{userInfo.userName}</Text>
            <Text style={styles.timestamp}>2時間前</Text>
          </View>
          <Button
            icon={{name: 'close', color: 'white'}}
            buttonStyle={{backgroundColor: 'transparent'}}
            onPress={navigateToGoback}
          />
        </View>
      </View>
      {onLoading && <ActivityIndicator size="large" style={styles.indicator} />}
    </TouchableOpacity>
  );
};

const {height, width} = Dimensions.get('window');

const MAX_PROGRESS_BAR = width - 20;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  info: {
    width: '95%',
    height: 65,
    position: 'absolute',
    top: height > X_HEIGHT ? 37 : 5,
    alignSelf: 'center',
  },
  progressBarConteiner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressBar: {
    width: MAX_PROGRESS_BAR,
    height: 3,
    marginTop: 8,
    borderRadius: 5,
    backgroundColor: '#bdbdbd',
    overflow: 'hidden',
  },
  animatedProgressBar: {
    height: 3,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  infoItems: {
    width: '100%',
    height: 45,
    marginTop: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    height: 45,
    marginTop: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    marginLeft: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  timestamp: {
    marginLeft: 10,
    color: 'white',
  },
  imageContainer: {
    backgroundColor: '#1f1f1f',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

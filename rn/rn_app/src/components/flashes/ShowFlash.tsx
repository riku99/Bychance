import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  Dimensions,
  Image,
  Animated,
  TouchableOpacity,
} from 'react-native';
import {Button} from 'react-native-elements';

import {X_HEIGHT} from '../../constants/device';
import {FlashUserInfo} from '../../components/users/UserProfile';
import {UserAvatar} from '../utils/Avatar';
import {Flash} from '../../redux/flashes';

const pic = require('../../assets/flight.jpg');

type Props = {
  userInfo: FlashUserInfo;
  flashes: Flash[];
  navigateToGoback: () => void;
};

export const ShowFlash = ({userInfo, flashes, navigateToGoback}: Props) => {
  const progressWidth = useMemo(() => {
    return MAX_PROGRESS_BAR / flashes.length - 1;
  }, [flashes.length]);

  const progressAnim = useRef<{[key: number]: Animated.Value}>({}).current;
  const progressValue = useRef(-progressWidth);
  const currentProgress = useRef(0);

  const progressAnimation = useCallback(
    (n: number) => {
      progressAnim[n].addListener((e) => {
        progressValue.current = e.value;
      });
      Animated.timing(progressAnim[n], {
        toValue: 0,
        duration: -progressValue.current / (progressWidth / 6000),
        useNativeDriver: true,
      }).start((e) => {
        let _n = ++n;
        if (e.finished && n < flashes.length) {
          currentProgress.current = _n;
          progressValue.current = -progressWidth;
          return progressAnimation(_n);
        }
      });
    },
    [flashes.length, progressAnim, progressWidth],
  );

  useEffect(() => {
    progressAnimation(0);
  }, [progressAnimation]);

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      delayLongPress={100}
      onPress={() => {}}
      onLongPress={() => {
        progressAnim[currentProgress.current].stopAnimation();
      }}
      onPressOut={() => {
        progressAnimation(currentProgress.current);
      }}
      onPressIn={() => {}}>
      <StatusBar hidden={true} />
      <Image source={pic} style={{width: '100%', height: '100%'}} />

      <View style={styles.info}>
        <View style={styles.progressBarConteiner}>
          {flashes.map((f, i) => {
            progressAnim[i] = new Animated.Value(-progressWidth);

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
});

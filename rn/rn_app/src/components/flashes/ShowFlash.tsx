import React, {useEffect, useRef} from 'react';
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

const pic = require('../../assets/flight.jpg');

type Props = {
  userInfo: FlashUserInfo;
  navigateToGoback: () => void;
};

export const ShowFlash = ({userInfo, navigateToGoback}: Props) => {
  const progressWidth = useRef(1);

  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: width - 20,
      duration: 3000,
      useNativeDriver: false,
    }).start();
  }, [progressAnim, progressWidth]);

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      delayLongPress={100}
      onPress={() => {}}
      onLongPress={() => {
        progressAnim.stopAnimation();
      }}
      onPressOut={() => {
        Animated.timing(progressAnim, {
          toValue: width - 20,
          duration:
            (width - 20 - progressWidth.current) / ((width - 20) / 3000),
          useNativeDriver: false,
        }).start();
      }}>
      <StatusBar hidden={true} />
      <Image source={pic} style={{width: '100%', height: '100%'}} />

      <View style={styles.info}>
        <View style={styles.progressBar}>
          <Animated.View
            style={{...styles.animatedProgressBar, width: progressAnim}}
            onLayout={(e) => {
              progressWidth.current = e.nativeEvent.layout.width;
            }}
          />
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
  progressBar: {
    width: width - 20,
    height: 3,
    marginTop: 8,
    borderRadius: 5,
    backgroundColor: '#bdbdbd',
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

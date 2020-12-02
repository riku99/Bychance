import React, {useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  Dimensions,
  Image,
  Animated,
} from 'react-native';
import {Avatar, Button} from 'react-native-elements';

import {X_HEIGHT} from '../../constants/device';

const pic = require('../../assets/flight.jpg');

export const ShowFlash = () => {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: width - 20,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, [progressAnim]);

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <Image source={pic} style={{width: '100%', height: '100%'}} />

      <View style={styles.info}>
        <View style={styles.progressBar}>
          <Animated.View
            style={{...styles.animatedProgressBar, width: progressAnim}}
          />
        </View>
        <View style={styles.infoItems}>
          <View style={styles.userInfo}>
            <Avatar
              rounded
              size="small"
              avatarStyle={{backgroundColor: 'gray'}}
            />
            <Text style={styles.userName}>ユーザー名</Text>
            <Text style={styles.timestamp}>2時間前</Text>
          </View>
          <Button
            icon={{name: 'close', color: 'white'}}
            buttonStyle={{backgroundColor: 'transparent'}}
          />
        </View>
      </View>
    </View>
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
    backgroundColor: 'gray',
  },
  animatedProgressBar: {
    height: 3,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  infoItems: {
    width: '100%',
    height: 45,
    marginTop: 1,
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

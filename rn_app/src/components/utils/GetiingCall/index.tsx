import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSafeArea} from '~/hooks/appState';
import {UserAvatar} from '~/components/utils/Avatar';
import {Button} from 'react-native-elements';
import {useVideoCalling, useGettingCall} from '~/hooks/appState';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {CallEndButton} from '~/components/utils/CallEndButon';
import {useVideoCallingState} from '~/hooks/videoCalling';

export const GetiingCall = () => {
  const {top} = useSafeArea();
  const {setVideoCalling} = useVideoCalling();
  const {setGettingCall} = useGettingCall();
  const initialX = useSharedValue(-400);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: initialX.value}],
    };
  });
  const {videoCallingState} = useVideoCallingState();

  useEffect(() => {
    initialX.value = withTiming(0, {duration: 500});
  }, [initialX]);

  const start = () => {
    setGettingCall(false);
  };

  const onCallPress = () => {
    setVideoCalling(true);
    initialX.value = withTiming(-400, {duration: 500}, () => {
      runOnJS(start)();
    });
  };

  const end = () => {
    setGettingCall(false);
    setVideoCalling(false);
  };

  const onCallEndPress = () => {
    initialX.value = withTiming(-400, {duration: 500}, () => {
      runOnJS(end)();
    });
  };

  return (
    <Animated.View style={[animatedStyle, styles.container, {top}]}>
      <Text style={styles.name}>
        {videoCallingState ? videoCallingState.publisher?.name : ''}
      </Text>
      <View style={styles.buttonGroup}>
        <Button
          icon={{name: 'call', color: 'white', size: 28}}
          buttonStyle={[styles.button, {backgroundColor: '#05f55d'}]}
          activeOpacity={1}
          onPress={onCallPress}
        />
        <CallEndButton onPress={onCallEndPress} />
      </View>
      <UserAvatar
        image={videoCallingState ? videoCallingState.publisher?.image : null}
        size={54}
        containerStyle={styles.imageContainer}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '94%',
    height: 140,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignSelf: 'center',
    borderRadius: 30,
    padding: 20,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
  },
  imageContainer: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  buttonGroup: {
    marginTop: 22,
    flexDirection: 'row',
    width: '56%',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 52,
    width: 52,
    height: 52,
    padding: 0,
  },
});

import React, {useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';

import {VideoWithThumbnail} from '~/components/utils/VideowithThumbnail';
import {SkeltonLoadingView} from '~/components/utils/SkeltonLoadingView';
import {useBackGroundItemVideoPaused} from '~/hooks/appState';
import {RootNavigationProp} from '~/navigations/Root';
import {backgroundItemHeight} from './styles';
import {UserBackGroundItem} from '~/types';

type Props = {
  data?: UserBackGroundItem | null;
};

export const BackGroundItem = React.memo(({data}: Props) => {
  const {videoPaused, setVideoPaused} = useBackGroundItemVideoPaused();
  const navigation = useNavigation<RootNavigationProp<'Tab'>>();
  const onPress = () => {
    if (data?.url && data?.type) {
      setVideoPaused(true);
      navigation.navigate('UserBackGroundView', {
        url: data.url,
        type: data.type,
        width: data.width,
        height: data.height,
      });
    }
  };

  useEffect(() => {
    const unsbscribe = navigation.addListener('focus', () => {
      if (videoPaused) {
        setVideoPaused(false);
      }
    });

    return unsbscribe;
  }, [navigation, videoPaused, setVideoPaused]);

  if (data === undefined) {
    return (
      <SkeltonLoadingView>
        <View style={{height: backgroundItemHeight}} />
      </SkeltonLoadingView>
    );
  }

  if (data === null) {
    return null;
  }

  return (
    <>
      <TouchableOpacity
        style={styles.sourceContainer}
        onPress={onPress}
        activeOpacity={1}>
        {data.type === 'image' ? (
          <FastImage
            source={{uri: data.url}}
            style={styles.sourceStyle}
            resizeMode="cover"
          />
        ) : (
          <VideoWithThumbnail
            video={{
              source: {uri: data.url},
              resizeMode: 'cover',
              ignoreSilentSwitch: 'obey',
              paused: videoPaused,
            }}
            thumbnail={{
              resizeMode: 'cover',
            }}
          />
        )}
        <View style={styles.blurStyle} />
      </TouchableOpacity>
    </>
  );
});

const styles = StyleSheet.create({
  sourceStyle: {
    width: '100%',
    height: '100%',
  },
  sourceContainer: {
    position: 'absolute',
    zIndex: 10,
    width: '100%',
    height: '100%',
  },
  blurStyle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    opacity: 0.25,
  },
});

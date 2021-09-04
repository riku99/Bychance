import React, {useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';

import {VideoWithThumbnail} from '~/components/utils/VideowithThumbnail';
import {SkeltonLoadingView} from '~/components/utils/SkeltonLoadingView';
import {useBackGroundItemVideoPaused} from '~/hooks/appState';
import {RootNavigationProp} from '~/navigations/Root';
import {backgroundItemHeight} from './styles';

type Props = {
  source?: string | null;
  sourceType?: 'image' | 'video' | null;
  isLoading?: boolean;
};

export const BackGroundItem = React.memo(({source, sourceType}: Props) => {
  const {videoPaused, setVideoPaused} = useBackGroundItemVideoPaused();
  const navigation = useNavigation<RootNavigationProp<'Tab'>>();
  const onPress = () => {
    if (source && sourceType) {
      setVideoPaused(true);
      navigation.navigate('UserBackGroundView', {
        source,
        sourceType,
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

  if (source === undefined) {
    return (
      <SkeltonLoadingView>
        <View style={{height: backgroundItemHeight}} />
      </SkeltonLoadingView>
    );
  }

  if (!source) {
    return null;
  }

  return (
    <>
      <TouchableOpacity
        style={styles.sourceContainer}
        onPress={onPress}
        activeOpacity={1}>
        {sourceType === 'image' ? (
          <FastImage source={{uri: source}} style={styles.sourceStyle} />
        ) : (
          <VideoWithThumbnail
            video={{
              source: {uri: source},
              resizeMode: 'cover',
              ignoreSilentSwitch: 'obey',
              paused: videoPaused,
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

import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {getThumbnailUrl} from '~/helpers/video';
import {SkeltonLoadingView} from '~/components/utils/SkeltonLoadingView';
import {RootNavigationProp} from '~/navigations/Root';
import {backgroundItemHeight} from './styles';
import {UserBackGroundItem} from '~/types';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {
  data?: UserBackGroundItem | null;
};

export const BackGroundItem = React.memo(({data}: Props) => {
  const navigation = useNavigation<RootNavigationProp<'Tab'>>();
  const onPress = () => {
    if (data?.url && data?.type) {
      navigation.navigate('UserBackGroundView', {
        url: data.url,
        type: data.type,
        width: data.width,
        height: data.height,
      });
    }
  };

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

  const uri = data.type === 'image' ? data.url : getThumbnailUrl(data.url);

  return (
    <>
      <TouchableOpacity
        style={styles.sourceContainer}
        onPress={onPress}
        activeOpacity={1}>
        <FastImage
          source={{uri}}
          style={styles.sourceStyle}
          resizeMode="cover"
        />
        <View style={styles.blurStyle} />
        {data.type === 'video' && (
          <Icon
            name="play-arrow"
            color="white"
            size={38}
            style={styles.videoPlay}
          />
        )}
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
  videoPlay: {
    position: 'absolute',
    right: 10,
  },
});

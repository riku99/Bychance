import React, {useMemo} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {RouteProp} from '@react-navigation/native';

import {RootStackParamList, RootNavigationProp} from '~/navigations/Root';
import {VideoWithThumbnail} from '~/components/utils/VideowithThumbnail';
import {getResizeMode} from '~/utils';

type Props = {
  route: RouteProp<RootStackParamList, 'UserBackGroundView'>;
  navigation: RootNavigationProp<'UserBackGroundView'>;
};

export const UserBackGroundView = React.memo(({route}: Props) => {
  const {url, type, width, height} = useMemo(() => route.params, [
    route.params,
  ]);
  const resizeMode = getResizeMode({width, height});

  return (
    <View style={[styles.container]}>
      <View style={styles.sourceContainer}>
        {type === 'image' ? (
          <FastImage
            source={{uri: url}}
            style={styles.source}
            resizeMode={resizeMode}
          />
        ) : (
          <VideoWithThumbnail
            video={{
              source: {uri: url},
              repeat: true,
              ignoreSilentSwitch: 'obey',
              resizeMode,
            }}
            thumbnail={{
              resizeMode,
            }}
          />
        )}
      </View>
    </View>
  );
});

const {width} = Dimensions.get('screen');
const partsWidth = width / 3;
const sourceContainerHeight = partsWidth * 4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  sourceContainer: {
    width: '100%',
    height: sourceContainerHeight,
  },
  source: {
    width: '100%',
    height: '100%',
  },
  video: {
    position: 'absolute',
    zIndex: 10,
  },
});

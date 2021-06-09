import React, {useMemo} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {RouteProp} from '@react-navigation/native';

import {RootStackParamList, RootNavigationProp} from '~/screens/Root';
import {VideoWithThumbnail} from '~/components/utils/VideowithThumbnail';

type Props = {
  route: RouteProp<RootStackParamList, 'UserBackGroundView'>;
  navigation: RootNavigationProp<'UserBackGroundView'>;
};

// Videoのサムネイルはposterプロップスでも作れるが、FastImageでpreloadしたいのでFasImageを使って実現
export const UserBackGroundView = React.memo(({route}: Props) => {
  const {source, sourceType} = useMemo(() => route.params, [route.params]);

  return (
    <View style={[styles.container]}>
      <View style={styles.sourceContainer}>
        {sourceType === 'image' ? (
          <FastImage source={{uri: source}} style={styles.source} />
        ) : (
          <VideoWithThumbnail
            video={{
              source: {uri: source},
              repeat: true,
              ignoreSilentSwitch: 'ignore',
              resizeMode: 'cover',
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

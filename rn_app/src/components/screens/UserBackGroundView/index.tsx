import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {RouteProp} from '@react-navigation/native';

import {WideRangeSourceContainer} from '~/components/utils/WideRangeSourceContainer';
import {RootStackParamList, RootNavigationProp} from '~/screens/Root';
import {VideoWithThumbnail} from '~/components/utils/VideowithThumbnail';

type Props = {
  route: RouteProp<RootStackParamList, 'UserBackGroundView'>;
  navigation: RootNavigationProp<'UserBackGroundView'>;
};

// Videoのサムネイルはposterプロップスでも作れるが、FastImageでpreloadしたいのでFasImageを使って実現
export const UserBackGroundView = ({route}: Props) => {
  const {source, sourceType} = useMemo(() => route.params, [route.params]);

  return (
    <View>
      <WideRangeSourceContainer>
        {sourceType === 'image' ? (
          <FastImage source={{uri: source}} style={styles.source} />
        ) : (
          <VideoWithThumbnail
            video={{
              source: {uri: source},
              repeat: true,
              ignoreSilentSwitch: 'ignore',
            }}
          />
        )}
      </WideRangeSourceContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  source: {
    width: '100%',
    height: '100%',
  },
  video: {
    position: 'absolute',
    zIndex: 10,
  },
});

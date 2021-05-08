import React from 'react';
import {View, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';

type Props = {
  soruce: string | null;
  sorceType: 'image' | 'video' | null;
};

export const BackGroundItem = React.memo(({soruce, sorceType}: Props) => {
  return (
    <View>
      {soruce && sorceType ? (
        <>
          <FastImage source={{uri: soruce}} style={styles.sourceStyle} />
          <View style={styles.blurStyle} />
        </>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  sourceStyle: {
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

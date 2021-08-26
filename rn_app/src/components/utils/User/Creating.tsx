import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {UIActivityIndicator} from 'react-native-indicators';

import {useCreateingPost, useCreatingFlash} from '~/hooks/appState';

export const CreatingPost = () => {
  const {creatingPost} = useCreateingPost();

  return (
    <>
      {creatingPost && (
        <>
          <Text style={styles.text}>作成中です</Text>
          <View style={{width: 17}}>
            <UIActivityIndicator size={14} color="gray" />
          </View>
        </>
      )}
    </>
  );
};

export const CreatingFlash = () => {
  const {creatingFlash} = useCreatingFlash();

  return (
    <>
      {creatingFlash && (
        <>
          <Text style={styles.text}>作成中です</Text>
          <View style={{width: 17}}>
            <UIActivityIndicator size={14} color="gray" />
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: 'gray',
  },
});

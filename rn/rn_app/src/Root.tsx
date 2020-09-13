import React, {FC} from 'react';
import {View, StyleSheet} from 'react-native';

import {useLogin} from './hooks/useLogin';
import {CustomHeader} from './components/Header';
import {Hooter} from './components/Hooter';
import {UserProfileTable} from './components/UserProfileTable';

const Root: FC = () => {
  useLogin();
  return (
    <>
      <View style={styles.container}>
        <CustomHeader />
        <UserProfileTable />
        <View style={styles.block}></View>
        <View style={styles.hooter}>
          <Hooter />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  block: {
    height: 50,
  },
});

export default Root;

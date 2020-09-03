import React, {useEffect} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import LineLogin from '@xmartlabs/react-native-line';

const App: () => React.ReactNode = () => {
  return (
    <>
      <View style={styles.container}>
        <Text>hello world!</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;

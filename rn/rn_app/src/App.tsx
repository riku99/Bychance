import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

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

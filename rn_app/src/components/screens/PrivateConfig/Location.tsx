import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button} from 'react-native-elements';
import MapView from 'react-native-maps';

export const Location = React.memo(() => {
  return (
    <View style={styles.container}>
      <Button
        title="プライベートゾーンとは?"
        titleStyle={styles.descriptionButtonTitle}
        buttonStyle={styles.descriptionButton}
        activeOpacity={1}
      />
      <MapView style={styles.map} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  descriptionButton: {
    backgroundColor: 'transparent',
    width: 180,
    marginTop: 10,
  },
  descriptionButtonTitle: {
    color: '#4d4d4d',
    fontSize: 15,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  map: {
    height: '35%',
    width: '100%',
    marginTop: 10,
  },
});

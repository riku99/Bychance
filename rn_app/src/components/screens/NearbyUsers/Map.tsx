import React, {useContext, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import MapView from 'react-native-maps';

import {TabViewContext} from './index';

export const Map = React.memo(() => {
  const {lat, lng} = useContext(TabViewContext);

  const region = useMemo(() => {
    if (lat && lng) {
      return {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.005, // 縮尺の値を決める
        longitudeDelta: 0.005,
      };
    }
  }, [lat, lng]);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} showsUserLocation={true} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

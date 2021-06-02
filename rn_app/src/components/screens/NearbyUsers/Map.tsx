import React, {useContext, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

import {TabViewContext} from './index';
import {Avatar} from './Avatar';
import {NearbyUser} from '~/stores/nearbyUsers';

export const Map = React.memo(() => {
  const {lat, lng, users, onAvatarPress} = useContext(TabViewContext);

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

  const a = (user: NearbyUser) => {
    if (onAvatarPress) {
      if (user.flashes.entities.length && !user.flashes.isAllAlreadyViewed) {
        onAvatarPress({
          userId: user.id,
          isAllAlreadyViewed: false,
          flashesData: undefined,
        });
      }

      if (user.flashes.entities.length && user.flashes.isAllAlreadyViewed) {
        onAvatarPress({
          userId: user.id,
          isAllAlreadyViewed: true,
          flashesData: user.flashes,
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} showsUserLocation={true}>
        {users.map((user) => (
          <Marker
            key={user.id}
            coordinate={{latitude: user.lat, longitude: user.lng}}
            onPress={() => a(user)}>
            <Avatar user={user} size={35} />
          </Marker>
        ))}
      </MapView>
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

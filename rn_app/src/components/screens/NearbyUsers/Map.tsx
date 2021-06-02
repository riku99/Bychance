import React, {useCallback, useContext, useMemo} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';
import MIcon from 'react-native-vector-icons/MaterialIcons';

import {TabViewContext} from './index';
import {Avatar} from './Avatar';
import {NearbyUser} from '~/stores/nearbyUsers';
import {normalStyles} from '~/constants/styles/normal';

const gradientConfig: {
  colors: string[];
  start: {x: number; y: number};
  end: {x: number; y: number};
  baseStyle: ViewStyle;
} = {
  colors: [normalStyles.mainColor, '#ffc4c4'],
  start: {x: 0.0, y: 1.0},
  end: {x: 1.0, y: 1.0},
  baseStyle: {alignItems: 'center', justifyContent: 'center'},
};

export const Map = React.memo(() => {
  const {
    lat,
    lng,
    users,
    onAvatarPress,
    navigateToUserPage,
    refreshUsers,
  } = useContext(TabViewContext);

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

  const onMarkerPress = (user: NearbyUser) => {
    if (onAvatarPress && navigateToUserPage) {
      if (user.flashes.entities.length && !user.flashes.isAllAlreadyViewed) {
        onAvatarPress({
          userId: user.id,
          isAllAlreadyViewed: false,
          flashesData: undefined,
        });
        return;
      } else if (
        user.flashes.entities.length &&
        user.flashes.isAllAlreadyViewed
      ) {
        onAvatarPress({
          userId: user.id,
          isAllAlreadyViewed: true,
          flashesData: user.flashes,
        });
        return;
      } else {
        navigateToUserPage(user);
      }
    }
  };

  const onRefreshButtonPress = useCallback(() => {
    if (refreshUsers) {
      refreshUsers();
    }
  }, [refreshUsers]);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} showsUserLocation={true}>
        {users.map((user) => (
          <Marker
            key={user.id}
            coordinate={{latitude: user.lat, longitude: user.lng}}
            onPress={() => onMarkerPress(user)}>
            <Avatar user={user} size={35} />
          </Marker>
        ))}
      </MapView>
      <TouchableOpacity
        style={styles.refreshButtonContainer}
        activeOpacity={1}
        onPress={onRefreshButtonPress}>
        <LinearGradient
          colors={gradientConfig.colors}
          start={gradientConfig.start}
          end={gradientConfig.end}
          style={styles.refreshButtonContainer}>
          <MIcon name="refresh" size={30} color="white" />
        </LinearGradient>
      </TouchableOpacity>
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
  refreshButtonContainer: {
    position: 'absolute',
    bottom: '3%',
    left: '7%',
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshButton: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});

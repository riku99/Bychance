import React, {useCallback, useContext, useMemo, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {UIActivityIndicator} from 'react-native-indicators';

import {TabViewContext, UserData} from './index';
import {Avatar} from './Avatar';
import {mainButtonGradientConfig} from '~/constants/styles';

export const Map = React.memo(() => {
  const {
    lat,
    lng,
    users,
    onAvatarPress,
    navigateToUserPage,
    refreshUsers,
  } = useContext(TabViewContext);

  const [refreshing, setRefreshing] = useState(false);

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

  // MarkerでpointerEvent使えなくてAvatarのonPress実行できないのでMarkerコンポーネントから実行
  const onMarkerPress = (user: UserData) => {
    if (onAvatarPress && navigateToUserPage) {
      if (
        user.flashesData.entities.length &&
        !user.flashesData.viewedAllFlashes
      ) {
        onAvatarPress({
          viewedAllFlashes: false,
          flashes: undefined,
          user: {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
          },
        });
        return;
      } else if (
        user.flashesData.entities.length &&
        user.flashesData.viewedAllFlashes
      ) {
        onAvatarPress({
          viewedAllFlashes: true,
          flashes: user.flashesData.entities,
          user: {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
          },
        });
        return;
      } else {
        // navigateToUserPage(user);
        console.log('navigateします');
      }
    }
  };

  const onRefreshButtonPress = useCallback(async () => {
    if (refreshUsers) {
      setRefreshing(true);
      await refreshUsers();
      setRefreshing(false);
    }
  }, [refreshUsers]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}>
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
          colors={mainButtonGradientConfig.colors}
          start={mainButtonGradientConfig.start}
          end={mainButtonGradientConfig.end}
          style={styles.refreshButtonContainer}>
          {!refreshing ? (
            <MIcon name="refresh" size={30} color="white" />
          ) : (
            <UIActivityIndicator color="white" size={20} />
          )}
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

import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button} from 'react-native-elements';
import MapView from 'react-native-maps';
import {useSelector} from 'react-redux';

import {RootState} from '~/stores';

export const Location = React.memo(() => {
  const lat = useSelector((state: RootState) => state.userReducer.user!.lat);
  const lng = useSelector((state: RootState) => state.userReducer.user!.lng);

  const region = useMemo(() => {
    if (lat && lng) {
      return {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      };
    }
  }, [lat, lng]);

  return (
    <View style={styles.container}>
      <Button
        title="プライベートゾーンとは?"
        titleStyle={styles.descriptionButtonTitle}
        buttonStyle={styles.descriptionButton}
        activeOpacity={1}
      />
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        onPress={(e) => console.log(e.nativeEvent)}
      />
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

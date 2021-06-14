import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-elements';
import MapView, {MapEvent} from 'react-native-maps';
import {useSelector} from 'react-redux';
import Geocoder from 'react-native-geocoding';

import {RootState} from '~/stores';
import {credentials} from '~/credentials';
import {normalStyles} from '~/constants/styles';

// Geocoder.init(credentials.GCP_API_KEY, {language: 'ja'});

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

  const [selectedAddress, setSelectedAdress] = useState('千葉県千葉市幕張1-1');
  const [selectedCoordinate, setSelectedCoordinate] = useState<{
    lat: number;
    lng: number;
  }>();

  const onSelectMap = useCallback((e: MapEvent) => {
    const {coordinate} = e.nativeEvent;
    console.log(coordinate);
    // アドレスの変換
  }, []);

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
        onPress={onSelectMap}
      />
      <View style={styles.selectedAddressContainer}>
        <View style={{maxWidth: '65%'}}>
          <Text style={styles.selectedAdressTitle}>選択された住所</Text>
          <Text style={styles.selectedAdress}>{selectedAddress}</Text>
        </View>
        <Button
          title="追加"
          buttonStyle={styles.addButton}
          titleStyle={styles.addButtonTitle}
        />
      </View>
      <View style={styles.currentAdrressContainer}>
        <Text style={styles.selectedAdressTitle}>
          現在設定されているプライベートゾーン
        </Text>
      </View>
    </View>
  );
});

const fontColor = '#4d4d4d';
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
    color: fontColor,
    fontSize: 15,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  map: {
    height: '35%',
    width: '100%',
    marginTop: 10,
  },
  selectedAddressContainer: {
    marginTop: 15,
    width: '96%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedAdressTitle: {
    color: fontColor,
    fontWeight: '500',
  },
  selectedAdress: {
    fontSize: 15,
    marginTop: 10,
    // backgroundColor: 'red',
    maxWidth: '100%',
  },
  addButton: {
    width: 55,
    height: 30,
    backgroundColor: normalStyles.mainColor,
  },
  addButtonTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  currentAdrressContainer: {
    marginTop: 30,
    width: '96%',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
});

import React, {useCallback, useMemo, useRef, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Button, Divider} from 'react-native-elements';
import MapView, {MapEvent, Marker} from 'react-native-maps';
import {useSelector} from 'react-redux';
import Geocoder from 'react-native-geocoding';
import {Modalize} from 'react-native-modalize';

import {RootState} from '~/stores';
import {credentials} from '~/credentials';
import {normalStyles} from '~/constants/styles';
import {formatAddress} from '~/utils';
import {AboutPrivateZoneModal} from './AboutPrivateZoneModal';
import {ToastLoading} from '~/components/utils/ToastLoading';

Geocoder.init(credentials.GCP_API_KEY, {language: 'ja'});

export const Location = React.memo(() => {
  const aboutPrivateZoneModalRef = useRef<Modalize>(null);

  const onAboutPrivateZoneButton = useCallback(() => {
    if (aboutPrivateZoneModalRef.current) {
      aboutPrivateZoneModalRef.current.open();
    }
  }, []);

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

  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedCoordinate, setSelectedCoordinate] = useState<{
    lat: number;
    lng: number;
  }>();

  const onSelectMap = useCallback(async (e: MapEvent) => {
    const {coordinate} = e.nativeEvent;
    setSelectedCoordinate({
      lat: coordinate.latitude,
      lng: coordinate.longitude,
    });
    const addressData = await Geocoder.from(
      coordinate.latitude,
      coordinate.longitude,
    );
    const _address = formatAddress(addressData.results[0].formatted_address);
    setSelectedAddress(_address);
  }, []);

  return (
    <View style={styles.container}>
      <Button
        title="プライベートゾーンとは?"
        titleStyle={styles.descriptionButtonTitle}
        buttonStyle={styles.descriptionButton}
        activeOpacity={1}
        onPress={onAboutPrivateZoneButton}
      />
      <MapView
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        onPress={onSelectMap}>
        {selectedCoordinate && (
          <Marker
            coordinate={{
              latitude: selectedCoordinate.lat,
              longitude: selectedCoordinate.lng,
            }}
          />
        )}
      </MapView>
      <View style={styles.selectedAddressContainer}>
        <View style={{maxWidth: '65%'}}>
          <Text style={styles.selectedAddressTitle}>選択された住所</Text>
          <Text style={styles.selectedAddress}>{selectedAddress}</Text>
        </View>
        <Button
          title="追加"
          buttonStyle={styles.addressButton}
          titleStyle={styles.addressButtonTitle}
          disabled={!selectedCoordinate && !selectedAddress}
        />
      </View>
      <Divider style={styles.diver} />
      <View style={styles.currentAdrressContainer}>
        <Text style={styles.currentAddressTitle}>
          現在設定されているプライベートゾーン
        </Text>
        {/* {currnetPrivateZone.map((p) => (
          <View key={p.id} style={styles.currentAddressSet}>
            <Text style={styles.currentAddress}>{p.address}</Text>
            <Button
              buttonStyle={styles.addressButton}
              title="削除"
              titleStyle={styles.addressButtonTitle}
            />
          </View>
        ))} */}
      </View>
      <AboutPrivateZoneModal modalRef={aboutPrivateZoneModalRef} />
      <ToastLoading />
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
  selectedAddressTitle: {
    color: fontColor,
    fontWeight: '500',
  },
  selectedAddress: {
    fontSize: 15,
    marginTop: 10,
    maxWidth: '100%',
  },
  addressButton: {
    width: 55,
    height: 30,
    backgroundColor: normalStyles.mainColor,
  },
  addressButtonTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  currentAdrressContainer: {
    width: '96%',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  currentAddressTitle: {
    color: fontColor,
    fontWeight: '500',
  },
  currentAddressSet: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentAddress: {
    fontSize: 15,
    maxWidth: '96%',
  },
  diver: {
    width: '90%',
    alignSelf: 'center',
    marginVertical: 30,
  },
});

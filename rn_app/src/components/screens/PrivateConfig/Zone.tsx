import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import {Button, Divider} from 'react-native-elements';
import MapView, {MapEvent, Marker} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import {Modalize} from 'react-native-modalize';

import {credentials} from '~/credentials';
import {formatAddress} from '~/utils';
import {AboutPrivateZoneModal} from './AboutPrivateZoneModal';
import {usePrivateZone} from '~/hooks/privateZone';
import {PrivateZone} from '~/types';
import {commonStyles} from './common';
import {useMyLng, useMyLat, useIsDisplayedToOtherUsers} from '~/hooks/users';
import {defaultTheme} from '~/theme';

Geocoder.init(credentials.GCP_API_KEY, {language: 'ja'});

export const Zone = React.memo(() => {
  const {
    result: _privateZone,
    fetchLoading,
    createPrivateZone,
    deletePrivateZone,
  } = usePrivateZone();

  const {getIsDisplayedToOtherUsers} = useIsDisplayedToOtherUsers();

  const aboutPrivateZoneModalRef = useRef<Modalize>(null);
  const [currentPrivateZone, setCurrentPrivateZone] = useState<PrivateZone[]>(
    [],
  );

  useEffect(() => {
    if (_privateZone) {
      setCurrentPrivateZone(_privateZone);
    }
  }, [_privateZone]);

  const onAboutPrivateZoneButton = useCallback(() => {
    if (aboutPrivateZoneModalRef.current) {
      aboutPrivateZoneModalRef.current.open();
    }
  }, []);

  const lat = useMyLat();
  const lng = useMyLng();

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

  const onAddButtonPress = useCallback(async () => {
    if (selectedCoordinate && selectedAddress) {
      const postResult = await createPrivateZone({
        address: selectedAddress,
        lat: selectedCoordinate.lat,
        lng: selectedCoordinate.lng,
      });

      getIsDisplayedToOtherUsers();

      if (postResult) {
        setCurrentPrivateZone((c) => [postResult, ...c]);
      }
    }
  }, [
    createPrivateZone,
    selectedCoordinate,
    selectedAddress,
    setCurrentPrivateZone,
    getIsDisplayedToOtherUsers,
  ]);

  const onDeleteButtonPress = useCallback(
    (id: number) => {
      Alert.alert('プライベートゾーンを削除', '削除してよろしいですか?', [
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            const result = await deletePrivateZone(id);

            getIsDisplayedToOtherUsers();

            if (result) {
              setCurrentPrivateZone((c) => c.filter((z) => z.id !== id));
            }
          },
        },
        {
          text: 'キャンセル',
        },
      ]);
    },
    [deletePrivateZone, getIsDisplayedToOtherUsers],
  );

  return (
    <View style={styles.container}>
      <View>
        <Button
          title="プライベートゾーンとは?"
          titleStyle={commonStyles.descriptionButtonTitle}
          buttonStyle={commonStyles.descriptionButton}
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
            buttonStyle={styles.addAddressButton}
            titleStyle={styles.addressButtonTitle}
            disabled={!selectedCoordinate && !selectedAddress}
            onPress={onAddButtonPress}
            activeOpacity={1}
          />
        </View>
        <Divider style={styles.diver} />
      </View>
      <View style={styles.currentAdrressContainer}>
        <ScrollView>
          <Text style={styles.currentAddressTitle}>
            現在設定されているプライベートゾーン
          </Text>
          {currentPrivateZone.map((p) => (
            <View key={p.id} style={styles.currentAddressSet}>
              <Text style={styles.currentAddress}>{p.address}</Text>
              <Button
                buttonStyle={styles.deleteAddressButton}
                title="削除"
                titleStyle={styles.addressButtonTitle}
                onPress={() => onDeleteButtonPress(p.id)}
                activeOpacity={1}
              />
            </View>
          ))}
          {fetchLoading && <ActivityIndicator style={{marginTop: 15}} />}
        </ScrollView>
      </View>

      <AboutPrivateZoneModal modalRef={aboutPrivateZoneModalRef} />
      <SafeAreaView />
    </View>
  );
});

const {height} = Dimensions.get('screen');

const fontColor = '#4d4d4d';
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: height * 0.25,
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
  addAddressButton: {
    width: 55,
    height: 30,
    backgroundColor: defaultTheme.pinkGrapefruit,
  },
  deleteAddressButton: {
    width: 55,
    height: 30,
    backgroundColor: 'gray',
  },
  addressButtonTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  currentAdrressContainer: {
    width: '96%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    height: height * 0.38,
  },
  currentAddressTitle: {
    color: fontColor,
    fontWeight: '500',
  },
  currentAddressSet: {
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentAddress: {
    fontSize: 15,
    maxWidth: '65%',
  },
  diver: {
    width: '90%',
    alignSelf: 'center',
    marginVertical: 30,
  },
});

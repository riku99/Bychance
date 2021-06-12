import React, {useMemo, useState} from 'react';
import {View, StyleSheet, Text, Alert} from 'react-native';
import BackgroundGeolocation from 'react-native-background-geolocation';

import {commonStyles} from './constants';
import {ConfigList, List} from './List';
import {CustomPopupModal} from '~/components/utils/PopupModal';
import {deleteLocationInfoThunk} from '~/apis/users/deleteLocation';
import {updateLocationThunk} from '~/apis/users/updateLocation';
import {useCustomDispatch} from '~/hooks/stores';
import {displayShortMessage} from '~/helpers/topShortMessage';
import {getCurrentPosition} from '~/helpers/geolocation';

export const LocationConfig = React.memo(() => {
  const dispatch = useCustomDispatch();
  const [showAboutLocationInfoModal, setShowAboutLocationInfoModal] = useState(
    false,
  );
  const list: List = useMemo(() => {
    return [
      {
        title: '位置情報を削除',
        onItemPress: () => {
          Alert.alert('位置情報を削除', '位置情報を削除しますか?', [
            {
              text: '削除',
              onPress: async () => {
                const result = await dispatch(deleteLocationInfoThunk());
                if (deleteLocationInfoThunk.fulfilled.match(result)) {
                  displayShortMessage('削除しました', 'success');
                  const state = await BackgroundGeolocation.getState();
                  if (state.enabled) {
                    BackgroundGeolocation.stop(); // 位置情報の取得を停止
                  }
                }
              },
              style: 'destructive',
            },
            {
              text: 'いいえ',
              onPress: () => {},
            },
          ]);
        },
      },
      {
        title: '位置情報を更新',
        onItemPress: () => {
          Alert.alert(
            '位置情報を更新',
            '現在の位置情報が取得、保存されます。\n 更新しますか?',
            [
              {
                text: '更新',
                style: 'destructive',
                onPress: async () => {
                  const currentPosition = await getCurrentPosition();
                  if (!currentPosition) {
                    return;
                  }
                  const result = await dispatch(
                    updateLocationThunk({
                      lat: currentPosition.coords.latitude,
                      lng: currentPosition.coords.longitude,
                    }),
                  );
                  if (updateLocationThunk.fulfilled.match(result)) {
                    displayShortMessage('更新しました', 'success');
                    const state = await BackgroundGeolocation.getState();
                    if (!state.enabled) {
                      BackgroundGeolocation.start();
                    }
                  }
                },
              },
              {
                text: 'いいえ',
                onPress: () => {},
              },
            ],
          );
        },
      },
      {
        title: '位置情報について',
        description: true,
        onItemPress: () => setShowAboutLocationInfoModal(true),
      },
    ];
  }, [dispatch]);

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.sectionContainer}>
        <ConfigList list={list} />
      </View>
      <CustomPopupModal
        isVisible={showAboutLocationInfoModal}
        closeModal={() => setShowAboutLocationInfoModal(false)}>
        <View style={styles.aboutLocationInfoModal}>
          <Text style={styles.aboutLocationInfoText}>
            位置情報を削除した場合、このアプリ内の位置情報に関するサービスは利用できなくなります。
            また、位置情報が自動で更新されることもなくなります。
            {'\n'}
            再度取得、更新をしたい場合は「位置情報を更新」を行ってください。
            {'\n'}なお、位置情報は常に暗号化されて保存されます。
          </Text>
        </View>
      </CustomPopupModal>
    </View>
  );
});

const styles = StyleSheet.create({
  aboutLocationInfoModal: {
    ...commonStyles.descriptionModal,
    width: '90%',
    height: 250,
  },
  aboutLocationInfoText: {
    fontSize: 16,
    marginHorizontal: 10,
    marginVertical: 10,
    lineHeight: 18,
  },
});

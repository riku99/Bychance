import React, {useMemo, useRef} from 'react';
import {View, StyleSheet, Text, Alert, Dimensions} from 'react-native';
import {Modalize} from 'react-native-modalize';

import {commonStyles} from './constants';
import {ConfigList, List} from './List';
import {deleteLocationInfoThunk} from '~/thunks/users/deleteLocation';
import {useCustomDispatch} from '~/hooks/stores';
import {displayShortMessage} from '~/helpers/topShortMessage';
import BackgroundGeolocation from 'react-native-background-geolocation';
import {notAuthLocationProviderAlert} from '~/helpers/alert';

export const LocationConfig = React.memo(() => {
  const dispatch = useCustomDispatch();

  const aboutLocationInfoModalRef = useRef<Modalize | null>(null);
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
            '現在の位置情報に更新されます。更新しますか?',
            [
              {
                text: '更新',
                style: 'destructive',
                onPress: async () => {
                  const authState = await BackgroundGeolocation.getProviderState();
                  if (!authState.enabled) {
                    notAuthLocationProviderAlert();
                    return;
                  }
                  try {
                    await BackgroundGeolocation.getCurrentPosition({});
                    displayShortMessage('更新しました', 'success');
                  } catch {
                    displayShortMessage('更新に失敗しました', 'danger');
                    return;
                  }
                },
              },
              {
                text: 'いいえ',
              },
            ],
          );
        },
      },
      {
        title: '位置情報について',
        description: true,
        onItemPress: () => {
          if (aboutLocationInfoModalRef) {
            aboutLocationInfoModalRef.current?.open();
          }
        },
      },
    ];
  }, [dispatch]);

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.sectionContainer}>
        <ConfigList list={list} />
      </View>
      <Modalize modalHeight={height * 0.8} ref={aboutLocationInfoModalRef}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>位置情報について</Text>
          <Text style={styles.explanation}>
            端末の設定で許可されている限り、位置情報は自動で更新されます。
            {'\n'}
            {'\n'}
            位置情報を削除した場合、このアプリ内の位置情報に関するサービスは利用できなくなります。
            {'\n'}
            {'\n'}
            一度削除してもお使いの端末により位置情報の変更が検知された場合は再度更新、保存されます。これを無効にするにはお使いの端末の設定から位置情報を無効にしてください。
            {'\n'}
            {'\n'}
            「位置情報を更新」を押すと現在の位置情報に更新されます。 {'\n'}
            前述の通り許可されている限り位置情報は自動で更新することができますが、何らかの理由で自動更新がされていない場合などに使ってみてください。
            {'\n'}
            {'\n'}
            なお、位置情報は常に暗号化されて保存されます。
          </Text>
        </View>
      </Modalize>
    </View>
  );
});

const {height} = Dimensions.get('screen');

const styles = StyleSheet.create({
  modalContainer: {
    marginHorizontal: 10,
    marginTop: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  explanation: {
    marginTop: 15,
    lineHeight: 17,
    fontSize: 16,
    color: '#4d4d4d',
  },
});

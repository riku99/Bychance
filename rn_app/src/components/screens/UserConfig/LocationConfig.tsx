import React, {useMemo, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';

import {commonStyles} from './constants';
import {ConfigList, List} from './List';
import {CustomPopupModal} from '~/components/utils/PopupModal';

export const LocationConfig = React.memo(() => {
  const [showAboutLocationInfoModal, setShowAboutLocationInfoModal] = useState(
    false,
  );
  const list: List = useMemo(() => {
    return [
      {
        title: '位置情報を削除',
      },
      {
        title: '位置情報を更新',
      },
      {
        title: '位置情報について',
        description: true,
        onItemPress: () => setShowAboutLocationInfoModal(true),
      },
    ];
  }, []);
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
            位置情報は暗号化されて保存されます。
          </Text>
        </View>
      </CustomPopupModal>
    </View>
  );
});

const styles = StyleSheet.create({
  aboutLocationInfoModal: {
    ...commonStyles.descriptionModal,
  },
  aboutLocationInfoText: {
    fontSize: 16,
    marginHorizontal: 10,
    marginVertical: 10,
  },
});

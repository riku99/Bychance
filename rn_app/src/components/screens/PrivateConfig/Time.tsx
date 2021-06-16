import React, {useCallback, useRef} from 'react';
import {StyleSheet, View, Text, SafeAreaView, Dimensions} from 'react-native';
import {Button, Divider} from 'react-native-elements';

import {commonStyles} from './common';
import {AboutPrivateTimeModal} from './AboutPrivateTimeModal';
import {Modalize} from 'react-native-modalize';
import {normalStyles} from '~/constants/styles';

export const Time = React.memo(() => {
  const aboutPrivateTimeModalRef = useRef<Modalize>(null);

  const onAboutPrivateTimeButtonPress = useCallback(() => {
    if (aboutPrivateTimeModalRef.current) {
      aboutPrivateTimeModalRef.current.open();
    }
  }, []);
  return (
    <View style={styles.container}>
      <Button
        title="プライベートタイムとは?"
        titleStyle={commonStyles.descriptionButtonTitle}
        buttonStyle={commonStyles.descriptionButton}
        activeOpacity={1}
        onPress={onAboutPrivateTimeButtonPress}
      />
      <View style={styles.selectTimeContainer}>
        <View style={styles.timeSection}>
          <Text style={styles.sectionTitle}>開始</Text>
          <Button
            title="選択する"
            buttonStyle={styles.selectButton}
            titleStyle={styles.selectButotnTitle}
            activeOpacity={1}
          />
        </View>
        <Divider style={styles.divider} />
        <View style={styles.timeSection}>
          <Text style={styles.sectionTitle}>終了</Text>
          <Button
            title="選択する"
            buttonStyle={styles.selectButton}
            titleStyle={styles.selectButotnTitle}
            activeOpacity={1}
          />
        </View>
        <Button
          buttonStyle={styles.addButton}
          title="追加"
          titleStyle={styles.addButotnTitleStyle}
          activeOpacity={1}
          disabled={true}
        />
      </View>
      <SafeAreaView />
      <AboutPrivateTimeModal modalRef={aboutPrivateTimeModalRef} />
    </View>
  );
});

const {height} = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selectTimeContainer: {
    width: '100%',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  timeSection: {
    height: 70,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 16,
  },
  divider: {
    width: '100%',
    alignSelf: 'center',
  },
  selectButton: {
    backgroundColor: normalStyles.mainColor,
    height: 30,
  },
  selectButotnTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    width: 80,
    marginTop: 15,
    backgroundColor: normalStyles.mainColor,
  },
  addButotnTitleStyle: {
    fontSize: 14,
    fontWeight: '500',
  },
});

import React, {useCallback, useRef, useState} from 'react';
import {StyleSheet, View, Text, SafeAreaView, Dimensions} from 'react-native';
import {Button, Divider} from 'react-native-elements';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import {commonStyles} from './common';
import {AboutPrivateTimeModal} from './AboutPrivateTimeModal';
import {Modalize} from 'react-native-modalize';
import {normalStyles} from '~/constants/styles';

type PrivateTime = {
  startHours: number;
  startMinutes: number;
  endHours: number;
  endMinutes: number;
};

export const Time = React.memo(() => {
  const aboutPrivateTimeModalRef = useRef<Modalize>(null);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [startTime, setStartTime] = useState<{
    startHours: number;
    startMinutes: number;
  }>();
  const [endTime, setEndTime] = useState<{
    endHours: number;
    endMinutes: number;
  }>();

  const onAboutPrivateTimeButtonPress = useCallback(() => {
    if (aboutPrivateTimeModalRef.current) {
      aboutPrivateTimeModalRef.current.open();
    }
  }, []);

  const onSelectTimeButtonPress = () => {
    setDatePickerVisibility(true);
  };

  const handleDateConfirm = (d: Date) => {
    const h = d.getHours();
    const m = d.getMinutes();

    setStartTime({
      startHours: h,
      startMinutes: m,
    });

    setDatePickerVisibility(false);
  };

  console.log(startTime);

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
            onPress={onSelectTimeButtonPress}
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
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleDateConfirm}
        onCancel={() => setDatePickerVisibility(false)}
        locale="en_GB"
        confirmTextIOS="OK"
        cancelTextIOS="キャンセル"
      />
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

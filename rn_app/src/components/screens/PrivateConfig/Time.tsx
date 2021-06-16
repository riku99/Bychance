import React, {useCallback, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
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
  const selectStartOrEnd = useRef<'start' | 'end'>();

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [startTime, setStartTime] = useState<{
    hours: number;
    minutes: number;
  }>();
  const [endTime, setEndTime] = useState<{
    hours: number;
    minutes: number;
  }>();

  const onAboutPrivateTimeButtonPress = useCallback(() => {
    if (aboutPrivateTimeModalRef.current) {
      aboutPrivateTimeModalRef.current.open();
    }
  }, []);

  const onSelectTimeButtonPress = (type: 'start' | 'end') => {
    selectStartOrEnd.current = type;
    setDatePickerVisibility(true);
  };

  const handleDateConfirm = (d: Date) => {
    const hours = d.getHours();
    const minutes = d.getMinutes();

    if (selectStartOrEnd.current === 'start') {
      setStartTime({
        hours,
        minutes,
      });
    }

    if (selectStartOrEnd.current === 'end') {
      setEndTime({
        hours,
        minutes,
      });
    }

    setDatePickerVisibility(false);
  };

  return (
    <View style={styles.container}>
      <Button
        title="プライベートタイムとは?"
        titleStyle={commonStyles.descriptionButtonTitle}
        buttonStyle={commonStyles.descriptionButton}
        activeOpacity={1}
        onPress={onAboutPrivateTimeButtonPress}
      />
      <View style={styles.mainContents}>
        <View style={styles.timeSection}>
          <Text style={styles.sectionTitle}>開始</Text>
          {startTime ? (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => onSelectTimeButtonPress('start')}>
              <Text style={styles.selectedTime}>
                {startTime.hours}:{startTime.minutes}
                {startTime.minutes === 0 && 0}
              </Text>
            </TouchableOpacity>
          ) : (
            <Button
              title="選択する"
              buttonStyle={styles.selectButton}
              titleStyle={styles.selectButotnTitle}
              activeOpacity={1}
              onPress={() => onSelectTimeButtonPress('start')}
            />
          )}
        </View>
        <Divider style={styles.divider} />
        <View style={styles.timeSection}>
          <Text style={styles.sectionTitle}>終了</Text>
          {endTime ? (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => onSelectTimeButtonPress('end')}>
              <Text style={styles.selectedTime}>
                {endTime.hours}:{endTime.minutes}
                {endTime.minutes === 0 && 0}
              </Text>
            </TouchableOpacity>
          ) : (
            <Button
              title="選択する"
              buttonStyle={styles.selectButton}
              titleStyle={styles.selectButotnTitle}
              activeOpacity={1}
              onPress={() => onSelectTimeButtonPress('end')}
            />
          )}
        </View>
        <Button
          buttonStyle={styles.addButton}
          title="追加"
          titleStyle={styles.addButotnTitleStyle}
          activeOpacity={1}
          disabled={!startTime || !endTime}
        />
        <Text style={styles.currentPrivateTimeTitle}>
          現在設定されているプライベートタイム
        </Text>
        <View style={styles.currentPrivateZoneSet}>
          <Text style={styles.currentPrivateTime}>23:00 ~ 3:00</Text>
          <Button
            title="削除"
            buttonStyle={styles.deleteButton}
            titleStyle={styles.deleteButtonTitle}
          />
        </View>
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

const fontColor = '#4d4d4d';
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContents: {
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
  selectedTime: {
    fontSize: 16,
  },
  currentPrivateTimeTitle: {
    color: fontColor,
    fontWeight: '500',
    marginTop: 60,
    marginBottom: 20,
  },
  currentPrivateZoneSet: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: 'gray',
    width: 55,
    height: 30,
  },
  deleteButtonTitle: {
    fontWeight: '500',
    fontSize: 15,
  },
  currentPrivateTime: {
    fontSize: 16,
  },
});

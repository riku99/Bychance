import React from 'react';
import {StyleSheet} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import {defaultTheme} from '~/theme';

type Props = {
  setRange: (n: number) => void;
};

const selectItems = [
  {label: '100m', value: 0.1},
  {label: '200m', value: 0.2},
  {label: '300m', value: 0.3},
  {label: '400m', value: 0.4},
  {label: '500m', value: 0.5},
  {label: '1km', value: 1},
];

// 現在使ってないけど一応残す
export const RangeSelector = React.memo(({setRange}: Props) => {
  return (
    <RNPickerSelect
      onValueChange={(value) => setRange(value)}
      placeholder={{}}
      doneText="完了"
      items={selectItems}
      style={{
        viewContainer: styles.pickerContainer,
        inputIOS: styles.inputIOS,
      }}
    />
  );
});

const styles = StyleSheet.create({
  pickerContainer: {
    backgroundColor: defaultTheme.pinkGrapefruit,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
  },
  inputIOS: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

import React, {useState} from 'react';
import {View, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';

import {strokeColors} from '~/constants/colors';

type Props = {
  onSelect?: (color: string) => any;
};

export const HorizontalColorPalette = ({onSelect}: Props) => {
  const [selectedColor, setSelectedColor] = useState(strokeColors[0].color);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="always">
        {strokeColors.map((value) => (
          <TouchableOpacity
            key={value.color}
            style={[
              styles.colors,
              {backgroundColor: value.color},
              {borderWidth: value.color === selectedColor ? 4 : 2},
            ]}
            activeOpacity={1}
            onPress={() => {
              if (onSelect) {
                onSelect(value.color);
              }
              setSelectedColor(value.color);
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  colors: {
    width: 30,
    height: 30,
    borderRadius: 30,
    marginHorizontal: 5,
    borderColor: 'white',
  },
});

import React, {useState} from 'react';
import {View, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';

const strokeColors = [
  {color: '#000000'},
  {color: '#FF0000'},
  {color: '#00FFFF'},
  {color: '#0000FF'},
  {color: '#0000A0'},
  {color: '#ADD8E6'},
  {color: '#800080'},
  {color: '#FFFF00'},
  {color: '#00FF00'},
  {color: '#FF00FF'},
  {color: '#FFFFFF'},
  {color: '#C0C0C0'},
  {color: '#808080'},
  {color: '#FFA500'},
  {color: '#A52A2A'},
  {color: '#800000'},
  {color: '#008000'},
  {color: '#808000'},
];

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

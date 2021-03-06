import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';

type Props = {
  onPress?: () => void;
};

export const MoreReadBottun = ({onPress}: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          if (onPress) {
            onPress();
          }
        }}>
        <Text style={styles.text}>もっと読む</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    color: 'gray',
  },
});

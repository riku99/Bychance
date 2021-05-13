import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';

type Props = {
  onDeletePress: () => void;
};

export const SwipeHiddenItems = React.memo(({onDeletePress}: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.rowContainer}
        onPress={onDeletePress}
        activeOpacity={1}>
        <Text style={styles.text}>削除</Text>
      </TouchableOpacity>
    </View>
  );
});

const {width} = Dimensions.get('screen');

export const hiddenRowItemWidth = width / 4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowContainer: {
    backgroundColor: '#f54542',
    height: '100%',
    width: hiddenRowItemWidth,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 17,
    fontWeight: '500',
    color: 'white',
  },
});

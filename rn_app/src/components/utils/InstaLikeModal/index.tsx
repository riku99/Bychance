import React from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';
import {Divider} from 'react-native-elements';

type ListItem = {
  title: string;
  color?: string;
  onPress: () => void;
};

type Props = {
  list: ListItem[];
  onCancel: () => void;
};

export const InstaLikeModal = React.memo(({onCancel, list}: Props) => {
  return (
    <View>
      <View style={styles.itemsContainer}>
        {list.map((l, idx) => (
          <View key={idx}>
            <Divider style={{width: '100%'}} color="#e6e6e6" />
            <Pressable
              style={({pressed}) => ({
                ...styles.item,
                backgroundColor: pressed ? '#f5f5f5' : undefined,
              })}
              onPress={l.onPress}>
              <Text
                style={[
                  styles.itemTitle,
                  {color: l.color ? l.color : undefined},
                ]}>
                {l.title}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>
      <Pressable
        style={[styles.cancelContainer, styles.item]}
        onPress={onCancel}>
        <Text style={styles.itemTitle}>キャンセル</Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  itemsContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
  },
  item: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
  },
  cancelContainer: {
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 15,
  },
});

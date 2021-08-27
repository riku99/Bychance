import React from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';
import {Divider} from 'react-native-elements';

const list = [
  {
    title: 'ブロックする',
    color: 'red',
  },
  {
    title: 'このアカウントについて',
  },
  {
    title: 'プロフィールURLをコピー',
  },
];

export const InstaLikeModal = React.memo(() => {
  return (
    <View>
      <View style={styles.itemsContainer}>
        {list.map((l, idx) => (
          <View key={idx}>
            <Divider style={{width: '100%'}} color="#e6e6e6" />
            <Pressable style={styles.item}>
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
      <View style={[styles.cancelContainer, styles.item]}>
        <Text style={styles.itemTitle}>キャンセル</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {},
  itemsContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
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

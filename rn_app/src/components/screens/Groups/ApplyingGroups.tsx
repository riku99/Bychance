import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';

import {useGetApplyingGroups} from '~/hooks/applyingGroups';
import {ListItem} from './ListItem';
import {useDeleteApplyingGroup} from '~/hooks/applyingGroups';

export const ApplyingGroups = React.memo(() => {
  const {applyingGroups, isLoading, setApplyingGroups} = useGetApplyingGroups();
  const {deleteApplyingGroup} = useDeleteApplyingGroup();

  const onDeletePress = ({id}: {id: number}) => {
    Alert.alert('取り消しますか?', '', [
      {
        text: '取り消す',
        style: 'destructive',
        onPress: async () => {
          const result = await deleteApplyingGroup({id});
          if (result) {
            setApplyingGroups((current) =>
              current.filter((c) => c.id !== result),
            );
          }
        },
      },
      {
        text: 'キャンセル',
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator style={{marginTop: 20}} />
      ) : (
        <ScrollView style={styles.contents}>
          {applyingGroups.map((d) => (
            <ListItem
              key={d.id}
              id={d.id}
              name={d.appliedUser.name}
              imageUrl={d.appliedUser.avatar}
              type="applying"
              onDeletePress={() => {
                onDeletePress({id: d.id});
              }}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contents: {
    paddingHorizontal: 5,
  },
});

import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';

import {useGetAppliedGroups} from '~/hooks/applyingGroups';
import {useGroupBadge} from '~/hooks/appState';
import {ListItem} from './ListItem';
import {useDeleteApplyingGroup} from '~/hooks/applyingGroups';

export const AppliedGroups = React.memo(() => {
  const {appliedGroups, isLoading, setAppliedGroups} = useGetAppliedGroups();
  const {setGroupBadge} = useGroupBadge();
  const {deleteApplyingGroup} = useDeleteApplyingGroup();

  const onDeletePress = ({id}: {id: number}) => {
    Alert.alert('削除しますか?', '', [
      {
        text: '削除する',
        style: 'destructive',
        onPress: async () => {
          const result = await deleteApplyingGroup({id});
          setAppliedGroups((current) => current.filter((c) => c.id !== result));
        },
      },
      {
        text: 'キャンセル',
      },
    ]);
  };

  useEffect(() => {
    if (!isLoading && !appliedGroups.length) {
      setGroupBadge(false);
    }
  }, [appliedGroups, setGroupBadge, isLoading]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator style={{marginTop: 20}} />
      ) : (
        <ScrollView style={styles.contents}>
          {appliedGroups.map((d) => (
            <ListItem
              key={d.id}
              id={d.id}
              name={d.applyingUser.name}
              imageUrl={d.applyingUser.avatar}
              type="applied"
              onDeletePress={() => {
                onDeletePress({id: d.id});
              }}
              onJoinPress={() => {
                // onJoinPress({ownerId: d.applyingUser.id});
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

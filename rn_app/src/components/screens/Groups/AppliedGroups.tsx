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
import {useJoinGroup} from '~/hooks/groups';

export const AppliedGroups = React.memo(() => {
  const {appliedGroups, isLoading, setAppliedGroups} = useGetAppliedGroups();
  const {setGroupBadge} = useGroupBadge();
  const {deleteApplyingGroup} = useDeleteApplyingGroup();
  const {join} = useJoinGroup();

  const onDeletePress = ({id}: {id: number}) => {
    Alert.alert('削除しますか?', '', [
      {
        text: 'キャンセル',
        style: 'cancel',
      },
      {
        text: '削除する',
        style: 'destructive',
        onPress: async () => {
          const result = await deleteApplyingGroup({id});
          setAppliedGroups((current) => current.filter((c) => c.id !== result));
        },
      },
    ]);
  };

  const onJoinPress = ({ownerId}: {ownerId: string}) => {
    Alert.alert(
      'グループになりますか?',
      '現在申請されている他の全てのグループと申請中のグループが取り消されます。',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: '参加する',
          onPress: async () => {
            const result = await join({ownerId});
            if (result) {
              setAppliedGroups([]);
            }
          },
        },
      ],
    );
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
                onJoinPress({ownerId: d.applyingUser.id});
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

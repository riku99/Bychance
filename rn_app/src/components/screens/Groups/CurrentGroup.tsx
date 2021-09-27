import React, {useCallback, useMemo} from 'react';
import {
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Text,
  Alert,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {MemberImages} from '~/components/utils/MemberImages';
import {LeaveButton} from './LeaveButton';
import {useGropuData, useDeleteGroup} from '~/hooks/groups';
import {useDeleteUsersGroupId, useMyId} from '~/hooks/users';

export const CurrentGroup = React.memo(() => {
  const {bottom} = useSafeAreaInsets();
  const {groupData, isLoading, setGroupData} = useGropuData();
  const {deleteGroup} = useDeleteGroup();
  const myId = useMyId();

  const membersData = useMemo(() => {
    if (!groupData?.presence) {
      return [];
    } else {
      return groupData.members.map((g) => ({
        id: g.id,
        imageUrl: g.avatar,
      }));
    }
  }, [groupData]);

  const {deleteGroupId} = useDeleteUsersGroupId();
  const onLeaveButtonPress = useCallback(() => {
    if (!groupData || !groupData.presence) {
      return;
    }

    if (groupData.ownerId === myId) {
      Alert.alert('グループを解散しますか?', '', [
        {
          text: '解散する',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteGroup();
            if (result) {
              setGroupData({presence: false});
            }
          },
        },
        {
          text: 'キャンセル',
        },
      ]);
    } else {
      Alert.alert('グループから抜けますか?', '', [
        {
          text: '抜ける',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteGroupId();
            if (result) {
              setGroupData({presence: false});
            }
          },
        },
        {
          text: 'キャンセル',
        },
      ]);
    }
  }, [deleteGroupId, setGroupData, groupData, myId, deleteGroup]);

  if (isLoading || !groupData) {
    return <ActivityIndicator style={{marginTop: 10}} />;
  }

  if (!groupData.presence) {
    return <Text style={styles.noGroupText}>グループに入っていません</Text>;
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.contents, {paddingBottom: bottom}]}>
      <View style={styles.a1}>
        <LeaveButton
          containerStyle={styles.buttonContainer}
          onPress={onLeaveButtonPress}
          title={
            groupData.ownerId === myId ? 'グループを解散' : 'グループから抜ける'
          }
        />
        {groupData.ownerId === myId && (
          <Text style={styles.ownerText}>あなたはグループのオーナーです</Text>
        )}
      </View>
      <Text style={styles.memberText}>メンバー</Text>
      <MemberImages
        data={membersData}
        containerStyle={{marginTop: 8, paddingLeft: 0}}
      />
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  contents: {
    paddingLeft: 15,
  },
  buttonContainer: {
    width: 160,
  },
  noGroupText: {
    alignSelf: 'center',
    marginTop: 20,
    fontSize: 15,
    color: 'gray',
    fontWeight: 'bold',
  },
  ownerText: {
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 10,
    color: 'red',
  },
  memberText: {
    fontWeight: 'bold',
    fontSize: 22,
    marginTop: 28,
  },
  a1: {
    flexDirection: 'row',
    marginTop: 15,
  },
});

import React, {useCallback, useMemo} from 'react';
import {
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Text,
  Alert,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {MemberImages} from '~/components/utils/MemberImages';
import {LeaveButton} from './LeaveButton';
import {useGropuData} from '~/hooks/groups';
import {useDeleteUsersGroupId} from '~/hooks/users';

export const CurrentGroup = React.memo(() => {
  const {bottom} = useSafeAreaInsets();
  const {groupData, isLoading, setGroupData} = useGropuData();

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
  }, [deleteGroupId, setGroupData]);

  if (isLoading) {
    return <ActivityIndicator style={{marginTop: 10}} />;
  }

  if (!groupData || !groupData.presence) {
    return <Text style={styles.noGroupText}>グループに入っていません</Text>;
  }

  return (
    <ScrollView contentContainerStyle={{paddingBottom: bottom}}>
      <LeaveButton
        containerStyle={styles.buttonContainer}
        onPress={onLeaveButtonPress}
      />
      <MemberImages data={membersData} containerStyle={{marginTop: 20}} />
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 15,
    marginLeft: 10,
    width: 160,
  },
  noGroupText: {
    alignSelf: 'center',
    marginTop: 20,
    fontSize: 15,
    color: 'gray',
    fontWeight: 'bold',
  },
});

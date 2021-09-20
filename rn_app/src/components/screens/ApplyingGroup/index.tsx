import React, {useEffect, useLayoutEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useToast} from 'react-native-fast-toast';

import {ListItem} from './ListItem';
import {
  useGetAppliedGroups,
  useGetApplyingGroups,
} from '~/hooks/applyingGroups';
import {useDeleteApplyingGroup} from '~/hooks/applyingGroups';
import {useToastLoading} from '~/hooks/appState';
import {useGroupBadge} from '~/hooks/appState';

export const ApplyingGroup = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'グループ',
    });
  }, [navigation]);

  const {setToastLoading} = useToastLoading();
  const toast = useToast();
  const {setGroupBadge} = useGroupBadge();

  const {applyedGroup, isLoading, setApplyedGroup} = useGetAppliedGroups();
  const {
    applyingGroups,
    isLoading: _loading,
    setApplyingGroups,
  } = useGetApplyingGroups();
  const {deleteApplyingGroup} = useDeleteApplyingGroup();

  const onDeletePress = async ({
    id,
    type,
  }: {
    id: number;
    type: 'applied' | 'applying';
  }) => {
    setToastLoading(true);
    const result = await deleteApplyingGroup({id});
    if (result) {
      if (type === 'applied') {
        setApplyedGroup((current) => current.filter((c) => c.id !== result));
      }

      if (type === 'applying') {
        setApplyingGroups((current) => current.filter((c) => c.id !== result));
      }
      toast?.show(type === 'applied' ? '削除しました' : '取り消しました', {
        type: 'success',
      });
    }
    setToastLoading(false);
  };

  useEffect(() => {
    if (!isLoading && !applyedGroup.length) {
      setGroupBadge(false);
    }
  }, [applyedGroup, setGroupBadge, isLoading]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contents}>
        <Text style={styles.title}>申請されているグループ</Text>
        <View style={styles.applyedList}>
          {isLoading ? (
            <ActivityIndicator style={{marginTop: 20}} />
          ) : (
            applyedGroup.map((d) => (
              <ListItem
                key={d.id}
                id={d.id}
                name={d.applyingUser.name}
                imageUrl={d.applyingUser.avatar}
                type="applied"
                onDeletePress={() => {
                  onDeletePress({id: d.id, type: 'applied'});
                }}
              />
            ))
          )}
        </View>
        <Text style={[styles.title, {marginTop: 25}]}>
          申請しているグループ
        </Text>
        {_loading ? (
          <ActivityIndicator style={{marginTop: 20}} />
        ) : (
          applyingGroups.map((d) => (
            <ListItem
              key={d.id}
              id={d.id}
              name={d.appliedUser.name}
              imageUrl={d.appliedUser.avatar}
              type="applying"
              onDeletePress={() => {
                onDeletePress({id: d.id, type: 'applying'});
              }}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 21,
    fontWeight: 'bold',
    marginTop: 15,
  },
  contents: {
    paddingHorizontal: 5,
  },
  applyedList: {
    marginTop: 6,
  },
});

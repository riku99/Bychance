import React, {useEffect, useLayoutEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useToast} from 'react-native-fast-toast';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBar,
} from '@react-navigation/material-top-tabs';

import {AppliedGroups} from './AppliedGroups';
import {ApplyingGroups} from './ApplyingGroups';
import {ListItem} from './ListItem';
import {
  useGetAppliedGroups,
  useGetApplyingGroups,
} from '~/hooks/applyingGroups';
import {useDeleteApplyingGroup} from '~/hooks/applyingGroups';
import {useToastLoading} from '~/hooks/appState';
import {useGroupBadge} from '~/hooks/appState';
import {RightButton} from './RightButton';
import {useJoinGroup} from '~/hooks/groups';

const TopTab = createMaterialTopTabNavigator();

export const ApplyingGroup = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'グループ',
      headerStyle: {shadowColor: 'transparent'},
      headerRight: () => {
        return <RightButton />;
      },
    });
  }, [navigation]);

  const {setToastLoading} = useToastLoading();
  const toast = useToast();
  const {setGroupBadge} = useGroupBadge();

  // const {applyedGroup, isLoading, setApplyedGroup} = useGetAppliedGroups();
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
    Alert.alert(type === 'applied' ? '削除しますか?' : '取り消しますか?', '', [
      {
        text: type === 'applied' ? '削除する' : '取り消す',
        style: 'destructive',
        onPress: async () => {
          setToastLoading(true);
          const result = await deleteApplyingGroup({id});
          if (result) {
            if (type === 'applied') {
              setApplyedGroup((current) =>
                current.filter((c) => c.id !== result),
              );
            }

            if (type === 'applying') {
              setApplyingGroups((current) =>
                current.filter((c) => c.id !== result),
              );
            }
            toast?.show(
              type === 'applied' ? '削除しました' : '取り消しました',
              {
                type: 'success',
              },
            );
          }
          setToastLoading(false);
        },
      },
      {
        text: 'キャンセル',
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TopTab.Navigator
        lazy
        tabBarOptions={{pressOpacity: 1, labelStyle: {fontWeight: 'bold'}}}>
        <TopTab.Screen
          name={'申請されている\nグループ'}
          component={AppliedGroups}
        />
        <TopTab.Screen name={'申請中の\nグループ'} component={ApplyingGroups} />
        <TopTab.Screen name="現在のグループ" component={AppliedGroups} />
      </TopTab.Navigator>
      {/* <ScrollView contentContainerStyle={styles.contents}>
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
                onJoinPress={() => {
                  onJoinPress({ownerId: d.applyingUser.id});
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
      </ScrollView> */}
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
    minHeight: 55,
  },
});

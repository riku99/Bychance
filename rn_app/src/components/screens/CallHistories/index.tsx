import React, {useLayoutEffect, useCallback} from 'react';
import {View, StyleSheet, ActivityIndicator, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProp} from '~/navigations/Root';
import {Text} from 'react-native-elements';
import {useCallHistories} from '~/hooks/videoCalling';
import {ListItem} from 'react-native-elements';
import {UserAvatar} from '~/components/utils/Avatar';
import {format} from 'date-fns';

export const CallHistories = React.memo(() => {
  const navigation = useNavigation<RootNavigationProp<'CallHistories'>>();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '着信履歴',
    });
  }, [navigation]);

  const {data} = useCallHistories();

  const renderItem = useCallback(
    ({item}: {item: NonNullable<typeof data>['callHistories'][number]}) => {
      return (
        <ListItem
          bottomDivider
          key={String(item.id)}
          onPress={() => {
            navigation.navigate('UserPage', {userId: item.publisher.id});
          }}>
          <UserAvatar image={item.publisher.avatar} size="small" />
          <ListItem.Content>
            <ListItem.Title style={styles.itemName}>
              {item.publisher.name}
            </ListItem.Title>
          </ListItem.Content>
          <Text style={{color: '#787878'}}>
            {format(new Date(item.createdAt), 'yyyy/MM/dd')}
          </Text>
        </ListItem>
      );
    },
    [navigation],
  );

  if (!data) {
    return <ActivityIndicator style={{marginTop: 20}} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.alertText}>
        ※着信があってから1日以内の、あなたが通話に出なかった履歴のみ表示されます。
      </Text>
      <FlatList
        data={data.callHistories}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingTop: 20,
  },
  alertText: {
    fontWeight: 'bold',
    paddingHorizontal: 16,
  },
  itemName: {
    fontWeight: 'bold',
  },
  listContainer: {
    marginTop: 20,
    paddingLeft: 22,
  },
});

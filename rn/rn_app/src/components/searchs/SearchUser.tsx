import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ListItem, Avatar} from 'react-native-elements';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch} from 'react-redux';

import {getOthersThunk} from '../../actions/others_action';

const suuny = require('../../assets/sunny.jpg');
const ojisan = require('../../assets/ojisan.jpg');

const List = [
  {name: 'Sunny', image: suuny, message: 'エサ欲しい'},
  {
    name: 'おじさん',
    image: ojisan,
    message: 'DM送ってください',
  },
];

export const SearchUser = () => {
  const isFocused = useIsFocused();
  const dis = useDispatch();

  useEffect(() => {
    if (isFocused) {
      dis(getOthersThunk());
    }
  });

  return (
    <ScrollView style={styles.container}>
      {List.map((u, i) => (
        <ListItem
          key={i}
          onPress={() => {
            console.log('List');
          }}>
          <Avatar rounded size="medium" source={u.image} />
          <ListItem.Content>
            <ListItem.Title>{u.name}</ListItem.Title>
            <ListItem.Subtitle style={styles.subtitle}>
              {u.message}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#999999',
    marginTop: 3,
  },
});

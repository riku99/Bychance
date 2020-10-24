import React from 'react';
import {StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ListItem, Avatar} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {OtherUserType} from '../../redux/others';
import {SearchStackParamList} from '../../screens/Search';
const noImage = require('../../assets/no-Image.png');

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

type PropsType = {
  others: OtherUserType[];
};

type NavigationProp = StackNavigationProp<SearchStackParamList, 'SearchOthers'>;

export const SearchOthers = ({others}: PropsType) => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <ScrollView style={styles.container}>
      {others.length
        ? others.map((u, i) => (
            <ListItem
              key={i}
              onPress={() => {
                navigation.push('OtherProfile', {
                  id: u.id,
                  name: u.name,
                  image: u.image,
                  introduce: u.introduce,
                  message: u.message,
                  posts: u.posts,
                });
              }}>
              <Avatar
                rounded
                size="medium"
                source={u.image ? {uri: u.image} : noImage}
              />
              <ListItem.Content>
                <ListItem.Title>{u.name}</ListItem.Title>
                <ListItem.Subtitle style={styles.subtitle}>
                  {u.message}
                </ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          ))
        : null}
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

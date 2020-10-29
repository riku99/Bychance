import React, {
  MutableRefObject,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ListItem, Avatar} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {SearchBar} from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';

import {OtherUserType} from '../../redux/others';
import {SearchStackParamList} from '../../screens/Search';
const noImage = require('../../assets/no-Image.png');

type PropsType = {
  others: OtherUserType[];
  refRange: MutableRefObject<number>;
  setRange: Dispatch<SetStateAction<number>>;
};

type NavigationProp = StackNavigationProp<SearchStackParamList, 'SearchOthers'>;

export const SearchOthers = ({others, refRange, setRange}: PropsType) => {
  const navigation = useNavigation<NavigationProp>();
  const [displayedUsers, setDisplayedUsers] = useState(others);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    if (keyword === '') {
      setDisplayedUsers(others);
    } else {
      const matchedUsers = others.filter((u) => {
        return (
          u.name.toLowerCase().includes(keyword.toLowerCase()) ||
          u.introduce.toLowerCase().includes(keyword.toLowerCase()) ||
          u.message.toLowerCase().includes(keyword.toLowerCase())
        );
      });
      setDisplayedUsers(matchedUsers);
    }
  }, [keyword, others]);

  return (
    <View style={styles.container}>
      <View style={styles.displayOptionsContainer}>
        <SearchBar
          placeholder="キーワードを検索"
          inputContainerStyle={styles.searchInputContainer}
          containerStyle={styles.searchContainer}
          lightTheme={true}
          round={true}
          value={keyword}
          onChangeText={(text) => {
            setKeyword(text);
          }}
        />
        <View style={{width: '90%', alignSelf: 'center'}}>
          <RNPickerSelect
            onValueChange={(value) => {
              refRange.current = value;
              setRange(refRange.current);
            }}
            items={[
              {label: '1km', value: 1},
              {label: '2km', value: 2},
              {label: '3km', value: 3},
              {label: '4km', value: 4},
              {label: '5km', value: 5},
            ]}
            placeholder={{}}
            style={{
              viewContainer: {
                width: '90%',
                height: 25,
                alignSelf: 'center',
                marginTop: 10,
              },
              inputIOS: {color: '#2c3e50', fontSize: 15, fontWeight: 'bold'},
            }}
            doneText="完了"
          />
        </View>
      </View>
      <ScrollView>
        {displayedUsers.length
          ? displayedUsers.map((u, i) => (
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  displayOptionsContainer: {
    backgroundColor: 'white',
  },
  searchContainer: {
    backgroundColor: 'white',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  searchInputContainer: {
    width: '90%',
    height: 30,
    backgroundColor: '#ebebeb',
    alignSelf: 'center',
  },
  iosPicker: {
    color: '#2c3e50',
    fontSize: 15,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#999999',
    marginTop: 3,
  },
});

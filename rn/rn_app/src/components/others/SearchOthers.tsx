import React, {
  MutableRefObject,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useRef,
} from 'react';
import {StyleSheet, View, Animated} from 'react-native';
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

  const scrollY = useRef(new Animated.Value(0)).current;
  const offsetY = useRef(0);

  const transformY = scrollY.interpolate({
    inputRange: [0, SEARCH_TAB_HEIGHT],
    outputRange: [0, -SEARCH_TAB_HEIGHT],
    extrapolate: 'clamp',
  });

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
      <Animated.View
        style={{
          ...styles.displayOptionsContainer,
          transform: [{translateY: transformY}],
        }}>
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
      </Animated.View>
      <ScrollView
        style={styles.fill}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {
            useNativeDriver: false,
          },
        )}
        onScrollEndDrag={(e) => {
          if (
            e.nativeEvent.contentOffset.y > offsetY.current &&
            e.nativeEvent.contentOffset.y > 80
          ) {
            Animated.timing(scrollY, {
              toValue: SEARCH_TAB_HEIGHT,
              duration: 800,
              useNativeDriver: false,
            }).start();
            offsetY.current = e.nativeEvent.contentOffset.y;
          } else if (e.nativeEvent.contentOffset.y < offsetY.current) {
            Animated.timing(scrollY, {
              toValue: 0,
              duration: 800,
              useNativeDriver: false,
            }).start();
            offsetY.current = e.nativeEvent.contentOffset.y;
          }
        }}>
        <View
          style={{
            ...styles.scrollViewContent,
          }}>
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
        </View>
      </ScrollView>
    </View>
  );
};

const SEARCH_TAB_HEIGHT = 80;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  displayOptionsContainer: {
    backgroundColor: 'white',
    height: SEARCH_TAB_HEIGHT,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
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
  fill: {
    flex: 1,
  },
  scrollViewContent: {
    marginTop: SEARCH_TAB_HEIGHT,
  },
  subtitle: {
    fontSize: 14,
    color: '#999999',
    marginTop: 3,
  },
});

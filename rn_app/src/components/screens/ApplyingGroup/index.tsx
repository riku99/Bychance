import React, {useLayoutEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {ListItem} from './ListItem';
import {
  useGetAppliedGroups,
  useGetApplyingGroups,
} from '~/hooks/applyingGroups';

const data = [
  {
    id: '1',
    imageUrl:
      'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/228569103_160333409558923_2070089261260133837_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=107&_nc_ohc=3v_klMRZDZcAX880FRN&edm=AP_V10EBAAAA&ccb=7-4&oh=ffc62f16085e0db0097f8d5351c8ce10&oe=614CD158&_nc_sid=4f375e',
    name: '橋本環奈',
  },
  {
    id: '2',
    imageUrl:
      'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/85175462_176285990335210_4065743884077831252_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=110&_nc_ohc=_-nO9KpDp2kAX81jfcc&edm=AP_V10EBAAAA&ccb=7-4&oh=925f32b5ab171c424f5b2f3c7a36d062&oe=614C3791&_nc_sid=4f375e',
    name: 'ザッカーバーグ',
  },
];

export const ApplyingGroup = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'グループ',
    });
  }, [navigation]);

  const {applyedGroup, isLoading} = useGetAppliedGroups();
  const {applyingGroups, isLoading: _loading} = useGetApplyingGroups();
  if (applyingGroups.length) {
    console.log(applyingGroups[0].appliedUser);
  }

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

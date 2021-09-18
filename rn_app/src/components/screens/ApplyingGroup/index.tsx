import React, {useLayoutEffect} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native-elements';

import {UserAvatar} from '~/components/utils/Avatar';
import {defaultTheme} from '~/theme';

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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contents}>
        <Text style={styles.title}>申請されているグループ</Text>
        <View style={styles.applyedList}>
          {data.map((d) => (
            <View style={styles.listItem} key={d.id}>
              <UserAvatar image={d.imageUrl} size="medium" />
              <View style={styles.listItemRight}>
                <Text style={styles.listText}>
                  <Text style={styles.name}>{d.name}</Text>
                  さんから申請されています。
                </Text>
                <View style={styles.buttons}>
                  <Button
                    title="参加する"
                    titleStyle={styles.buttonTitle}
                    buttonStyle={[
                      styles.button,
                      {
                        backgroundColor: defaultTheme.pinkGrapefruit,
                      },
                    ]}
                    activeOpacity={1}
                  />
                  <Button
                    title="削除する"
                    titleStyle={styles.buttonTitle}
                    buttonStyle={[
                      styles.button,
                      {
                        backgroundColor: defaultTheme.darkGray,
                      },
                    ]}
                    containerStyle={{marginLeft: 15}}
                    activeOpacity={1}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
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
    marginTop: 10,
  },
  listItem: {
    flexDirection: 'row',
    paddingVertical: 20,
  },
  listItemRight: {
    marginLeft: 8,
    justifyContent: 'space-between',
  },
  listText: {},
  name: {
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    width: 80,
    padding: 6,
  },
  buttonTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});

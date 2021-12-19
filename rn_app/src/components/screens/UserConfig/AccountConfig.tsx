import React, {useMemo} from 'react';
import {View, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {commonStyles} from './constants';
import {ConfigList} from './List';
import {useLogout} from '~/hooks/sessions';
import {RootNavigationProp} from '~/navigations/Root';

export const AccountConfig = React.memo(() => {
  const navigation = useNavigation<RootNavigationProp<'Tab'>>();

  const {logout} = useLogout();

  const list = useMemo(() => {
    return [
      // {
      //   title: '🚀 プラン変更',
      //   onItemPress: () => {
      //     navigation.navigate('ChangePlan');
      //   },
      // },
      {
        title: 'ログアウト',
        onItemPress: () => {
          Alert.alert('ログアウトしますか?', '', [
            {
              text: 'はい',
              style: 'destructive',
              onPress: async () => {
                navigation.goBack();
                await logout();
                return;
              },
            },
            {
              text: 'いいえ',
              onPress: () => {
                return;
              },
            },
          ]);
        },
      },
    ];
  }, [navigation, logout]);

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.sectionContainer}>
        <ConfigList list={list} />
      </View>
    </View>
  );
});

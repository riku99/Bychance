import React, {useMemo} from 'react';
import {View, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {commonStyles} from './constants';
import {ConfigList} from './List';
import {useLogout} from '~/hooks/sessions';
import {RootNavigationProp} from '~/navigations/Root';
import {useResetPasswordEmail} from '~/hooks/auth';
import {useToast} from 'react-native-fast-toast';

export const AccountConfig = React.memo(() => {
  const navigation = useNavigation<RootNavigationProp<'Tab'>>();
  const {logout} = useLogout();
  const {sendEmail} = useResetPasswordEmail();
  const toast = useToast();

  const list = useMemo(() => {
    return [
      // {
      //   title: '🚀 プラン変更',
      //   onItemPress: () => {
      //     navigation.navigate('ChangePlan');
      //   },
      // },
      {
        title: 'パスワード変更',
        onItemPress: () => {
          Alert.alert(
            'パスワードを変更しますか?',
            '一度ログアウトされ、登録したメールアドレスに変更用メールが送信されます',
            [
              {
                text: 'キャンセル',
                style: 'cancel',
              },
              {
                text: 'はい',
                onPress: async () => {
                  await sendEmail();
                  toast.show('送信しました', {type: 'success'});
                },
              },
            ],
          );
        },
      },
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

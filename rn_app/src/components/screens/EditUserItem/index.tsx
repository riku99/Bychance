import React, {useLayoutEffect, useEffect, useState} from 'react';
import {View, StyleSheet, TextInput, Text} from 'react-native';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import {Button} from 'react-native-elements';
import {RootStackParamList, RootNavigationProp} from '~/navigations/Root';
import {defaultTheme} from '~/theme';

export const UserEditForm = React.memo(() => {
  const {params} = useRoute<RouteProp<RootStackParamList, 'UserEditForm'>>();
  const navigation = useNavigation<RootNavigationProp<'UserEditForm'>>();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: params.type,
      headerRight: undefined,
      headerLeft: () => (
        <Button
          title="キャンセル"
          style={{marginBottom: 3}}
          titleStyle={{color: defaultTheme.darkGray}}
          buttonStyle={{backgroundColor: 'transparent'}}
          onPress={() => navigation.navigate('UserEdit')}
          activeOpacity={1}
        />
      ),
    });
  }, [params.type, navigation]);

  const [text, setText] = useState(params.value ? params.value : '');
  const [alert, setAlert] = useState('');

  useEffect(() => {
    if (params.type === '名前') {
      if (text && text.length > 20) {
        setAlert('20文字以下にしてください');
        return;
      } else if (text?.length === 0) {
        setAlert('名前を入力してください');
        return;
      } else if (alert && text && text?.length < 20 && text?.length !== 0) {
        setAlert('');
        return;
      }
    }

    if (params.type === '自己紹介') {
      if (text && text.length > 300) {
        setAlert('300文字以下にしてください');
        return;
      } else if (alert && text && text.length < 100) {
        setAlert('');
        return;
      }
    }

    if (params.type === 'ステータスメッセージ') {
      if (text && text.length > 20) {
        setAlert('20文字以下にしてください');
        return;
      } else if (alert && text && text.length < 50) {
        setAlert('');
      }
    }
  }, [params.type, text, alert]);

  const onCompletePress = () => {
    params.setValue(text);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {!!alert && <Text style={{marginTop: 20, color: 'red'}}>{alert}</Text>}
      <TextInput
        style={{
          ...styles.textArea,
          borderBottomColor: !alert ? 'lightgray' : 'red',
        }}
        multiline={params.type === '自己紹介' ? true : false}
        onChangeText={(t) => {
          setText(t);
        }}>
        {text}
      </TextInput>
      <Button
        title="保存"
        activeOpacity={1}
        containerStyle={{marginTop: 40, width: '90%'}}
        titleStyle={{fontWeight: 'bold', fontSize: 16}}
        disabled={!!alert}
        onPress={onCompletePress}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  textArea: {
    width: '90%',
    maxHeight: '35%',
    marginTop: 30,
    fontSize: 16,
    borderBottomWidth: 0.3,
  },
});

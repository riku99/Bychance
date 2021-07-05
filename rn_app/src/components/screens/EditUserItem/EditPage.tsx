import React, {useEffect, useLayoutEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {Button} from 'react-native-elements';

import {UserEditNavigationProp} from '../../../navigations/types';

type Props = {
  name?: string;
  introduce?: string;
  statusMessage?: string;
  saveEditData: ({
    name,
    introduce,
    statusMessage,
  }: {
    name?: string;
    introduce?: string;
    statusMessage?: string;
  }) => void;
  navigation: UserEditNavigationProp<
    'IntroduceEdit' | 'NameEdit' | 'StatusMessageEdit'
  >;
};

export const EditPage = ({
  name,
  introduce,
  statusMessage,
  saveEditData,
  navigation,
}: Props) => {
  const [text, setText] = useState(() => {
    if (name) {
      return name;
    }
    if (introduce) {
      return introduce;
    }
    if (statusMessage) {
      return statusMessage;
    }
  });

  const [alert, setAlert] = useState('');

  useEffect(() => {
    if (name) {
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

    if (introduce) {
      if (text && text.length > 300) {
        setAlert('300文字以下にしてください');
        return;
      } else if (alert && text && text.length < 100) {
        setAlert('');
        return;
      }
    }

    if (statusMessage) {
      if (text && text.length > 50) {
        setAlert('50文字以下にしてください');
        return;
      } else if (alert && text && text.length < 50) {
        setAlert('');
      }
    }
  }, [text, name, introduce, statusMessage, alert]);

  useLayoutEffect(() => {
    navigation.dangerouslyGetParent()?.setOptions({
      title: name ? '名前' : introduce ? '自己紹介' : 'ステータスメッセージ',
      headerRight: undefined,
    });
  }, [navigation, name, introduce, statusMessage]);

  return (
    <View style={styles.container}>
      {!!alert && <Text style={{marginTop: 20, color: 'red'}}>{alert}</Text>}
      <TextInput
        style={{
          ...styles.textArea,
          borderBottomColor: !alert ? 'lightgray' : 'red',
        }}
        multiline={introduce || introduce === '' ? true : false}
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
        onPress={() => {
          if (name) {
            saveEditData({name: text});
          }
          if (introduce || introduce === '') {
            saveEditData({introduce: text});
          }
          if (statusMessage || statusMessage === '') {
            saveEditData({statusMessage: text});
          }
        }}
      />
    </View>
  );
};

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

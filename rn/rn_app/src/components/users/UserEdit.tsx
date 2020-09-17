import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {Avatar, Button} from 'react-native-elements';

export const UserEdit = () => {
  const [name, setName] = useState('name'); // propsでname受け取る
  const [introduce, setIntroduce] = useState('intro'); // propsでintro受け取る
  return (
    <View style={styles.container}>
      <View style={styles.edit}>
        <View style={styles.image}>
          <Avatar
            rounded
            source={require('../../assets/ojisan.jpg')}
            size="large"
          />
          <Button
            title="プロフィール画像を変更"
            titleStyle={styles.imageButtonTitle}
            buttonStyle={styles.imageButton}
          />
        </View>
        <View style={styles.name}>
          <Text style={styles.nameLabel}>名前</Text>
          {name.length > 20 && (
            <Text style={{color: 'red'}}>20文字以下にしてください</Text>
          )}
          <TextInput
            style={name.length <= 20 ? styles.nameInput : styles.nameInputAlert}
            onChangeText={(text) => {
              setName(text);
            }}>
            {name}
          </TextInput>
        </View>
        <View style={styles.introduce}>
          <Text style={styles.introduceLabel}>自己紹介</Text>
          {introduce.length > 100 && (
            <Text style={{color: 'red'}}>100文字以下にしてください</Text>
          )}
          <TextInput
            style={
              introduce.length <= 100
                ? styles.introduceInput
                : styles.introduceInputAlert
            }
            multiline={true}
            onChangeText={(text) => {
              setIntroduce(text);
            }}>
            {introduce}
          </TextInput>
        </View>
        <Button
          title={'完了'}
          titleStyle={styles.completeTitle}
          buttonStyle={styles.completeButton}
          disabledStyle={{backgroundColor: 'transparent'}}
          disabled={(name.length > 20 || introduce.length > 100) && true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  edit: {
    display: 'flex',
    alignItems: 'center',
    width: '80%',
  },
  image: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 130,
    width: '80%',
  },
  imageButton: {
    backgroundColor: 'transparent',
  },
  imageButtonTitle: {
    color: '#4fa9ff',
    fontSize: 15,
  },
  name: {
    display: 'flex',
    height: 90,
    width: '100%',
    marginTop: 20,
  },
  nameLabel: {
    fontSize: 20,
  },
  nameInput: {
    fontSize: 20,
    marginTop: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#c9c9c9',
  },
  nameInputAlert: {
    fontSize: 20,
    marginTop: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: 'red',
  },
  introduce: {
    height: 180,
    width: '100%',
    marginTop: 10,
  },
  introduceLabel: {
    fontSize: 20,
  },
  introduceInput: {
    fontSize: 15,
    marginTop: 25,
    maxHeight: '50%',
    borderBottomWidth: 0.5,
    borderBottomColor: '#c9c9c9',
  },
  introduceInputAlert: {
    fontSize: 15,
    marginTop: 25,
    borderBottomWidth: 0.5,
    borderBottomColor: 'red',
  },
  completeButton: {
    backgroundColor: 'transparent',
  },
  completeTitle: {
    color: '#4fa9ff',
  },
});

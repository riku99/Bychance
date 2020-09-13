import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Avatar, Button} from 'react-native-elements';

export const UserProfile = () => {
  return (
    <View style={styles.profile}>
      <View style={styles.main}>
        <View style={styles.image}>
          <Avatar
            rounded
            source={require('../../assets/ojisan.jpg')}
            size="large"
          />
        </View>
        <View style={styles.name_box}>
          <Text style={styles.name}>Riku</Text>
        </View>
      </View>
      <View style={styles.edit}>
        <Button
          title="プロフィールを編集"
          titleStyle={styles.title_style}
          buttonStyle={styles.edit_button}
        />
      </View>
      <View style={styles.introduce}>
        <Text style={styles.introduce_text}>Hello</Text>
        <Text style={styles.introduce_text}>My name is riku</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profile: {
    height: 350,
  },
  main: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '41%',
    paddingLeft: 50,
    paddingRight: 50,
  },
  edit: {
    alignItems: 'center',
    height: '12%',
  },
  edit_button: {
    backgroundColor: 'white',
  },
  title_style: {color: 'blue'},
  introduce: {
    height: '47%',
    paddingLeft: 25,
    paddingRight: 25,
    borderBottomColor: '#e8e8e8',
    borderBottomWidth: 1,
  },
  introduce_text: {
    fontSize: 16,
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
  },
  name_box: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 180,
    height: 100,
  },
  name: {
    fontSize: 25,
  },
});

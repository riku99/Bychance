import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {Avatar, Button} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {UserStackParamList} from '../../screens/User';
import {ScrollView} from 'react-native-gesture-handler';
import {Container} from '../../containers/posts/Posts';

type Props = {
  name: string;
  image: string | null;
  introduce: string | null;
  postProcess: boolean | undefined;
};

type NavigationProp = StackNavigationProp<
  UserStackParamList,
  'UserProfileTable'
>;

export const UserProfile = ({name, image, introduce, postProcess}: Props) => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <ScrollView style={styles.container}>
      <View style={styles.image}>
        <Avatar
          rounded
          source={image ? {uri: image} : require('../../assets/ojisan.jpg')}
          size="large"
          placeholderStyle={{backgroundColor: 'transeparent'}}
        />
      </View>
      <View style={styles.name_box}>
        <Text style={styles.name}>{name}</Text>
      </View>
      <View style={styles.edit}>
        <Button
          title="プロフィールを編集"
          titleStyle={styles.title_style}
          buttonStyle={styles.edit_button}
          onPress={() => {
            navigation.push('UserEditTable');
          }}
        />
      </View>
      <View style={styles.introduce}>
        {introduce ? (
          <Text>{introduce}</Text>
        ) : (
          <View>
            <Text>Hello!</Text>
            <Text>My name is {name}</Text>
          </View>
        )}
      </View>
      {postProcess && (
        <View style={styles.postProcess}>
          <ActivityIndicator size="small" />
          <Text style={{marginLeft: 10, color: '#999999'}}>投稿中です</Text>
        </View>
      )}
      <Container />
    </ScrollView>
  );
};

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '8%',
  },
  name_box: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '3%',
  },
  name: {
    fontSize: 20,
  },
  edit: {
    alignItems: 'center',
    marginTop: '3%',
  },
  edit_button: {
    backgroundColor: 'transparent',
  },
  title_style: {
    color: '#4fa9ff',
    fontWeight: 'bold',
  },
  introduce: {
    minHeight: height / 5,
    paddingLeft: 25,
    paddingRight: 25,
    //borderBottomColor: '#e8e8e8',
    //borderBottomWidth: 1,
    marginTop: '3%',
  },
  introduce_text: {
    fontSize: 16,
  },
  postProcess: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    marginBottom: 5,
  },
  dummy: {
    height: width / 3,
  },
});

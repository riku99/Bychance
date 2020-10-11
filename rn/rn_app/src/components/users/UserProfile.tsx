import React, {useEffect, useState} from 'react';
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

import {RootStackParamList} from '../../screens/Root';
import {ScrollView} from 'react-native-gesture-handler';
import {Container as Posts} from '../../containers/posts/Posts';
import {checkKeychain} from '../../helpers/keychain';

type Props = {
  id: number;
  name: string;
  image: string | null;
  introduce: string | null;
  postProcess: boolean | undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Tab'>;

export const UserProfile = ({
  id,
  name,
  image,
  introduce,
  postProcess,
}: Props) => {
  const [keychainID, setKeychainID] = useState<null | number>(null);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const confirmUser = async () => {
      const keychain = await checkKeychain();
      if (keychain && keychain.id === id) {
        setKeychainID(keychain.id);
      }
    };
    confirmUser();
  }, [id]);

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
        {keychainID === id && (
          <Button
            title="プロフィールを編集"
            titleStyle={styles.title_style}
            buttonStyle={styles.edit_button}
            onPress={() => {
              navigation.push('UserEdit');
            }}
          />
        )}
      </View>
      <View style={styles.introduce}>
        {introduce && <Text>{introduce}</Text>}
      </View>
      {postProcess && (
        <View style={styles.postProcess}>
          <ActivityIndicator size="small" />
          <Text style={{marginLeft: 10, color: '#999999'}}>投稿中です</Text>
        </View>
      )}
      <Posts />
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

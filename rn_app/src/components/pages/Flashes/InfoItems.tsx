import React, {useMemo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native-elements';
import {useSelector} from 'react-redux';

import {UserAvatar} from '../../utils/Avatar';
import {RootState} from '../../../redux/index';
import {selectAnotherUser} from '../../../redux/getUsers';
import {selectChatPartner} from '../../../redux/chatPartners';
import {FlashStackNavigationProp} from '../../../screens/types';

type Props = {
  userData: {userId: number; from?: 'searchUsers' | 'chatRoom'};
  timestamp: string;
};

export const InfoItems = ({userData, timestamp}: Props) => {
  const referenceId = useSelector(
    (state: RootState) => state.userReducer.user!.id,
  );

  const user = useSelector((state: RootState) => {
    switch (userData.from) {
      case 'chatRoom':
        return selectChatPartner(state, userData.userId);
      case 'searchUsers':
        return selectAnotherUser(state, userData.userId);
      default:
        if (!userData.from && referenceId === userData.userId) {
          return state.userReducer.user;
        }
    }
  });

  const navigation = useNavigation<FlashStackNavigationProp<'Flashes'>>();

  const timeDiff = useMemo(() => {
    const now = new Date();
    const createdAt = new Date(timestamp);
    const diff = now.getTime() - createdAt.getTime();
    return Math.floor(diff / (1000 * 60 * 60));
  }, [timestamp]);

  const onUserPress = () => {
    navigation.push('UserPage', {userId: userData.userId, from: userData.from});
  };

  const onCloseButtonPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.infoItems}>
      <TouchableOpacity style={styles.userInfo} onPress={onUserPress}>
        <UserAvatar image={user?.image} size="small" opacity={1} />
        <Text style={styles.userName}>
          {user ? user.name : 'ユーザーが存在しません'}
        </Text>
        <Text style={styles.timestamp}>
          {timeDiff < 24 ? timeDiff.toString() + '時間前' : '1日前'}
        </Text>
      </TouchableOpacity>
      <Button
        icon={{name: 'close', color: 'white'}}
        buttonStyle={{backgroundColor: 'transparent'}}
        onPress={onCloseButtonPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoItems: {
    width: '100%',
    height: 45,
    marginTop: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    height: 45,
    marginTop: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    marginLeft: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  timestamp: {
    marginLeft: 10,
    color: 'white',
  },
});

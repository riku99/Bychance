import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {UserAvatar} from '../../utils/Avatar';
import {FlashStackNavigationProp} from '../../../navigations/types';
import {BackButton} from '~/components/utils/BackButton';
import {getTimeDiff} from '~/utils';

type Props = {
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
  timestamp: string;
  setIsNavigatedToProfile: React.Dispatch<React.SetStateAction<boolean>>;
};

export const InfoItems = ({
  user,
  timestamp,
  setIsNavigatedToProfile,
}: Props) => {
  const navigation = useNavigation<FlashStackNavigationProp<'Flashes'>>();

  const timeDiff = getTimeDiff(timestamp);

  const onUserPress = () => {
    // setIsNavigatedToProfile(true);
    // navigation.navigate('UserPage', {
    //   userId: userData.userId,
    //   from: userData.from,
    // });
  };

  return (
    <View style={styles.infoItems}>
      <TouchableOpacity
        style={styles.userInfo}
        onPress={onUserPress}
        activeOpacity={1}>
        <UserAvatar image={user?.avatar} size="small" opacity={1} />
        <Text style={styles.userName}>
          {user ? user.name : 'ユーザーが存在しません'}
        </Text>
        <Text style={styles.timestamp}>
          {timeDiff < 24 ? timeDiff.toString() + '時間前' : '1日前'}
        </Text>
      </TouchableOpacity>
      <BackButton
        icon={{name: 'close', color: 'white'}}
        buttonStyle={{backgroundColor: 'transparent'}}
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

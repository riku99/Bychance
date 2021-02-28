import React, {useMemo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native-elements';

import {UserAvatar} from '../../utils/Avatar';
import {FlashStackNavigationProp} from '../../../screens/types';
import {FlashUserData} from '../../../screens/Flashes';
import {useTimeDiff} from '../../../hooks/time';
import {useAnotherUser, useUser} from '../../../hooks/selector/user';

type Props = {
  userData: FlashUserData;
  timestamp: string;
  setIsNavigatedToProfile: React.Dispatch<React.SetStateAction<boolean>>;
};

export const InfoItems = ({
  userData,
  timestamp,
  setIsNavigatedToProfile,
}: Props) => {
  const me = useUser({from: userData.from});

  const anotherUser = useAnotherUser({
    from: userData.from,
    userId: userData.userId,
  });

  const user = useMemo(() => (me ? me : anotherUser!), [me, anotherUser]);

  const navigation = useNavigation<FlashStackNavigationProp<'Flashes'>>();

  const timeDiff = useTimeDiff({timestamp});

  const onUserPress = () => {
    setIsNavigatedToProfile(true);
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

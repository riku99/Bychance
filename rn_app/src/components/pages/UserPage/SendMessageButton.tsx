import React from 'react';
import {StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {AppDispatch} from '../../../stores/index';
import {resetRecievedMessage} from '../../../stores/otherSettings';
import {AnotherUser} from '../../../stores/types';
import {createRoomThunk} from '../../../actions/rooms/createRoom';
import {RootNavigationProp} from '../../../screens/types';
import {normalStyles} from '~/constants/styles/normal';

type Props = {
  user: AnotherUser;
};

export const SendMessageButton = React.memo(({user}: Props) => {
  const dispatch: AppDispatch = useDispatch();

  const navigation = useNavigation<RootNavigationProp<'Tab'>>();

  const onPress = async () => {
    const result = await dispatch(createRoomThunk({partner: user}));
    if (createRoomThunk.fulfilled.match(result)) {
      dispatch(resetRecievedMessage());
      navigation.push('ChatRoomStack', {
        screen: 'ChatRoom',
        params: {
          roomId: result.payload.roomId,
          partnerId: result.payload.partner.id,
        },
      });
    }
  };
  return (
    <Button
      title="メッセージを送る"
      icon={
        <Icon
          name="send-o"
          size={15}
          color={normalStyles.mainTextColor}
          style={{marginRight: 8}}
        />
      }
      titleStyle={styles.title}
      buttonStyle={styles.button}
      onPress={onPress}
    />
  );
});

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    color: normalStyles.mainTextColor,
  },
  button: {
    width: '90%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#2c3e50',
    backgroundColor: 'transparent',
    borderRadius: 30,
    height: 33,
  },
});

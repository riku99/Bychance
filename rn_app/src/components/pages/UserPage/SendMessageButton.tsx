import React from 'react';
import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import {Button} from 'react-native-elements';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import {AppDispatch} from '../../../stores/index';
import {resetRecievedMessage} from '../../../stores/otherSettings';
import {AnotherUser} from '../../../stores/types';
import {createRoomThunk} from '../../../apis/rooms/createTalkRoom';
import {RootNavigationProp} from '../../../screens/types';
import {normalStyles} from '~/constants/styles/normal';
import {TouchableOpacity} from 'react-native-gesture-handler';

const gradientConfig: {
  colors: string[];
  start: {x: number; y: number};
  end: {x: number; y: number};
  baseStyle: ViewStyle;
} = {
  colors: ['#faa0ab', '#ffb86b', '#fc8392', '#fc8392'],
  start: {x: 0.0, y: 1.0},
  end: {x: 1.0, y: 1.0},
  baseStyle: {alignItems: 'center', justifyContent: 'center'},
};

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
    // <Button
    //   title="メッセージを送る"
    //   titleStyle={styles.title}
    //   buttonStyle={styles.button}
    //   onPress={onPress}
    // />
    <View>
      <TouchableOpacity>
        <LinearGradient
          colors={gradientConfig.colors}
          start={gradientConfig.start}
          end={gradientConfig.end}
          style={{
            height: 33,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 30,
          }}>
          <View
            style={{
              height: 28,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 30,
              backgroundColor: 'white',
              width: '96%',
            }}>
            <Text>メッセージを送る</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
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

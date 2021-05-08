import React from 'react';
import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Emoji from 'react-native-emoji';

import {AppDispatch} from '../../../stores/index';
import {resetRecievedMessage} from '../../../stores/otherSettings';
import {AnotherUser} from '../../../stores/types';
import {createRoomThunk} from '../../../apis/rooms/createTalkRoom';
import {RootNavigationProp} from '../../../screens/types';
import {TouchableOpacity} from 'react-native-gesture-handler';

const gradientConfig: {
  colors: string[];
  start: {x: number; y: number};
  end: {x: number; y: number};
  baseStyle: ViewStyle;
} = {
  colors: ['#ff9791', '#f7b57c'],
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
    <View>
      <TouchableOpacity onPress={onPress} activeOpacity={1}>
        <LinearGradient
          colors={gradientConfig.colors}
          start={gradientConfig.start}
          end={gradientConfig.end}
          style={styles.gradationContainer}>
          <Text style={styles.title}>メッセージを送る</Text>
          <Emoji name="hatched_chick" style={{marginLeft: 2}} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontWeight: '500',
    fontSize: 15,
  },
  gradationContainer: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    flexDirection: 'row',
  },
});

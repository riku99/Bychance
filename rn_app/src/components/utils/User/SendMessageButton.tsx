import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Emoji from 'react-native-emoji';

import {RootNavigationProp} from '~/navigations/Root';
import {useCreateTalkRoom} from '~/hooks/talkRooms';
import {defaultTheme} from '~/theme';

type Props = {
  id: string;
};

export const SendMessageButton = React.memo(({id}: Props) => {
  const navigation = useNavigation<RootNavigationProp<'Tab'>>();

  const {createTalkRoom} = useCreateTalkRoom();

  const onPress = async () => {
    const result = await createTalkRoom({id});
    if (result) {
      navigation.push('TalkRoomStack', {
        screen: 'TalkRoom',
        params: {
          talkRoomId: result.roomId,
          partner: {
            id,
          },
        },
      });
    }
  };
  return (
    <View>
      <TouchableOpacity onPress={onPress} activeOpacity={1}>
        <LinearGradient
          colors={defaultTheme.mainButtonGradient.colors}
          start={defaultTheme.mainButtonGradient.start}
          end={defaultTheme.mainButtonGradient.end}
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

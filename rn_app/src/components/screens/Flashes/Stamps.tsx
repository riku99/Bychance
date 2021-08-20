import React, {useCallback, useMemo} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  TextStyle,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import {useFlashStamps} from '~/hooks/flashStamps';
import {useMyId} from '~/hooks/users';

type Props = {
  flashId: number;
};

const thumbsUp = 'thumbsUp';
const yusyo = 'yusyo';
const yoi = 'yoi';
const itibann = 'itibann';
const seikai = 'seikai';

export const Stamps = React.memo(({flashId}: Props) => {
  const myId = useMyId();
  const {data, createFlashStamps} = useFlashStamps({flashId});

  const _stampData = useMemo(() => {
    if (!data) {
      return [];
    }
    return [
      {
        label: '👍',
        value: thumbsUp,
        number: data.thumbsUp ? data.thumbsUp.userIds.length : 0,
        disabled: data.thumbsUp ? data.thumbsUp.userIds.includes(myId) : false,
      },
      {
        label: '優勝',
        value: yusyo,
        number: data.yusyo ? data.yusyo.userIds.length : 0,
        disabled: data.yusyo ? data.yusyo.userIds.includes(myId) : false,
        style: {
          fontFamily: 'Hiragino Sans',
          fontWeight: '700',
        },
      },
      {
        label: 'シンプルに\n良い',
        value: yoi,
        number: data.yoi ? data.yoi.userIds.length : 0,
        disabled: data.yoi ? data.yoi.userIds.includes(myId) : false,
        style: {
          fontSize: 9.5,
          fontFamily: 'Hiragino Sans',
          fontWeight: '700',
          color: 'pink',
        },
      },
      {
        label: 'お前が\n1番',
        value: itibann,
        number: data.itibann ? data.itibann.userIds.length : 0,
        disabled: data.itibann ? data.itibann.userIds.includes(myId) : false,
        style: {
          fontSize: 11,
          fontWeight: '700',
          color: '#ffae00',
        },
      },
      {
        label: '見て正解',
        value: seikai,
        number: data.seikai ? data.seikai.userIds.length : 0,
        disabled: data.seikai ? data.seikai.userIds.includes(myId) : false,
        style: {
          fontSize: 11,
          fontWeight: '700',
          color: '#004cff',
        },
      },
    ];
  }, [data, myId]);

  const createStamp = useCallback(
    async ({value}: {value: string}) => {
      createFlashStamps({value, userId: myId});
    },
    [createFlashStamps, myId],
  );

  return (
    <View style={styles.container}>
      {_stampData.map((_data) => {
        return (
          <TouchableOpacity
            style={[
              styles.stamp,
              {
                backgroundColor: _data.disabled
                  ? 'rgba(88,88,88,0.85)'
                  : 'rgba(133,133,133,0.85)',
              },
            ]}
            key={_data.label}
            activeOpacity={1}
            disabled={_data.disabled}
            onPress={() => {
              ReactNativeHapticFeedback.trigger('impactMedium', {
                enableVibrateFallback: true,
              });
              _data.number += 1;
              createStamp({value: _data.value});
            }}>
            <Text
              style={[
                styles.stampText,
                _data.style ? (_data.style as TextStyle) : undefined,
              ]}>
              {_data.label}
            </Text>
            <Text style={styles.stampNumber}>{_data.number}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

const {width} = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stamp: {
    width: width / 5 - 2.5,
    height: 35,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  stampText: {
    fontSize: 15,
  },
  stampNumber: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
});

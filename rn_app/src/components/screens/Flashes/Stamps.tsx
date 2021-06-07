import React, {useCallback, useMemo} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  TextStyle,
} from 'react-native';
import {useSelector} from 'react-redux';

import {createFlashStampThunk} from '~/apis/flashStamps/createFlashStamp';
import {useCustomDispatch} from '~/hooks/stores/dispatch';
import {Flash} from '~/stores/flashes';
import {RootState} from '~/stores';

type StampData = {
  label: string;
  value: string;
  number: number;
  style?: TextStyle;
  disabled: boolean;
};

type Props = {
  flash: Flash;
  userId: string;
};

export const Stamps = React.memo(({flash, userId}: Props) => {
  const {thumbsUp, yusyo, yoi, itibann, seikai} = useMemo(() => flash.stamps, [
    flash.stamps,
  ]);

  const myId = useSelector((state: RootState) => state.userReducer.user!.id);

  const stampData: StampData[] = useMemo(() => {
    return [
      {
        label: '👍',
        value: 'thumbsUp',
        number: thumbsUp.number,
        disabled: thumbsUp.userIds.includes(myId),
      },
      {
        label: '優勝',
        value: 'yusyo',
        number: yusyo.number,
        disabled: yusyo.userIds.includes(myId),
        style: {
          fontFamily: 'Hiragino Sans',
          fontWeight: '700',
        },
      },
      {
        label: 'シンプルに\n良い',
        value: 'yoi',
        number: yoi.number,
        disabled: yoi.userIds.includes(myId),
        style: {
          fontSize: 9.5,
          fontFamily: 'Hiragino Sans',
          fontWeight: '700',
          color: 'pink',
        },
      },
      {
        label: 'お前が\n1番',
        value: 'itibann',
        number: itibann.number,
        disabled: itibann.userIds.includes(myId),
        style: {
          fontSize: 11,
          fontWeight: '700',
          color: '#ffae00',
        },
      },
      {
        label: '見て正解',
        value: 'seikai',
        number: seikai.number,
        disabled: seikai.userIds.includes(myId),
        style: {
          fontSize: 11,
          fontWeight: '700',
          color: '#004cff',
        },
      },
    ];
  }, [thumbsUp, yusyo, yoi, itibann, seikai, myId]);

  const dispatch = useCustomDispatch();

  const createStamp = useCallback(
    async ({value}: {value: string}) => {
      await dispatch(
        createFlashStampThunk({
          flashId: flash.id,
          value,
          anotherUserId: userId,
        }),
      );
    },
    [dispatch, flash.id, userId],
  );

  return (
    <View style={styles.container}>
      {stampData.map((data) => {
        return (
          <TouchableOpacity
            style={[
              styles.stamp,
              {
                backgroundColor: data.disabled
                  ? 'rgba(88,88,88,0.85)'
                  : 'rgba(133,133,133,0.85)',
              },
            ]}
            key={data.label}
            activeOpacity={0.7}
            disabled={data.disabled}
            onPress={() => createStamp({value: data.value})}>
            <Text style={[styles.stampText, {...data.style}]}>
              {data.label}
            </Text>
            <Text style={styles.stampNumber}>{data.number}</Text>
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

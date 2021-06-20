import React, {useCallback, useLayoutEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  TextStyle,
} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import {createFlashStampThunk} from '~/thunks/flashStamps/createFlashStamp';
import {useCustomDispatch} from '~/hooks/stores';
import {Flash} from '~/stores/flashes';
import {RootState} from '~/stores';
import {selectFlashStampEntites} from '~/stores/flashStamps';

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
  const myId = useSelector((state: RootState) => state.userReducer.user!.id);

  const stampValuesData = useSelector(
    (state: RootState) => selectFlashStampEntites(state)[flash.id],
    shallowEqual,
  );

  const _stampData: StampData[] = useMemo(() => {
    return [
      {
        label: '👍',
        value: 'thumbsUp',
        number: stampValuesData ? stampValuesData.data.thumbsUp.number : 0,
        disabled: stampValuesData
          ? stampValuesData.data.thumbsUp.userIds.includes(myId)
          : false,
      },
      {
        label: '優勝',
        value: 'yusyo',
        number: stampValuesData ? stampValuesData.data.yusyo.number : 0,
        disabled: stampValuesData
          ? stampValuesData.data.yusyo.userIds.includes(myId)
          : false,
        style: {
          fontFamily: 'Hiragino Sans',
          fontWeight: '700',
        },
      },
      {
        label: 'シンプルに\n良い',
        value: 'yoi',
        number: stampValuesData ? stampValuesData.data.yoi.number : 0,
        disabled: stampValuesData
          ? stampValuesData.data.yoi.userIds.includes(myId)
          : false,
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
        number: stampValuesData ? stampValuesData.data.itibann.number : 0,
        disabled: stampValuesData
          ? stampValuesData.data.itibann.userIds.includes(myId)
          : false,
        style: {
          fontSize: 11,
          fontWeight: '700',
          color: '#ffae00',
        },
      },
      {
        label: '見て正解',
        value: 'seikai',
        number: stampValuesData ? stampValuesData.data.seikai.number : 0,
        disabled: stampValuesData
          ? stampValuesData.data.seikai.userIds.includes(myId)
          : false,
        style: {
          fontSize: 11,
          fontWeight: '700',
          color: '#004cff',
        },
      },
    ];
  }, [stampValuesData, myId]);

  const [stampData, setStampData] = useState<StampData[]>(_stampData);

  useLayoutEffect(() => {
    setStampData(_stampData);
  }, [_stampData]);

  const dispatch = useCustomDispatch();

  const createStamp = useCallback(
    async ({value}: {value: string}) => {
      setStampData((current) => {
        return current.map((st) => {
          if (st.value === value) {
            const newData = {
              ...st,
              number: st.number,
              disabled: true,
            };
            return newData;
          }

          return st;
        });
      });
      await dispatch(
        createFlashStampThunk({
          flashId: flash.id,
          value,
          ownerId: userId,
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
            activeOpacity={1}
            disabled={data.disabled}
            onPress={() => {
              ReactNativeHapticFeedback.trigger('impactMedium', {
                enableVibrateFallback: true,
              });
              data.number += 1;
              createStamp({value: data.value});
            }}>
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

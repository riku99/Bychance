import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  TextStyle,
} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';

import {createFlashStampThunk} from '~/apis/flashStamps/createFlashStamp';
import {useCustomDispatch} from '~/hooks/stores/dispatch';
import {Flash} from '~/stores/flashes';
import {RootState} from '~/stores';
import {selectNearbyUser} from '~/stores/nearbyUsers';

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

  const user = useSelector(
    (state: RootState) => selectNearbyUser(state, userId),
    shallowEqual,
  );

  const reducerStampData = useMemo(() => {
    if (user) {
      const f = user.flashes.entities.find((e) => e.id === flash.id);
      if (f) {
        return f.stamps;
      }
    }
  }, [user, flash.id]);

  const stampValues = useMemo(() => reducerStampData, [reducerStampData]);

  const _stampData: StampData[] = useMemo(() => {
    if (stampValues) {
      return [
        {
          label: '👍',
          value: 'thumbsUp',
          number: stampValues.thumbsUp.number,
          disabled: stampValues.thumbsUp.userIds.includes(myId),
        },
        {
          label: '優勝',
          value: 'yusyo',
          number: stampValues.yusyo.number,
          disabled: stampValues.yusyo.userIds.includes(myId),
          style: {
            fontFamily: 'Hiragino Sans',
            fontWeight: '700',
          },
        },
        {
          label: 'シンプルに\n良い',
          value: 'yoi',
          number: stampValues.yoi.number,
          disabled: stampValues.yoi.userIds.includes(myId),
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
          number: stampValues.itibann.number,
          disabled: stampValues.itibann.userIds.includes(myId),
          style: {
            fontSize: 11,
            fontWeight: '700',
            color: '#ffae00',
          },
        },
        {
          label: '見て正解',
          value: 'seikai',
          number: stampValues.seikai.number,
          disabled: stampValues.seikai.userIds.includes(myId),
          style: {
            fontSize: 11,
            fontWeight: '700',
            color: '#004cff',
          },
        },
      ];
    } else {
      return [];
    }
  }, [stampValues, myId]);

  const [stampData, setStampData] = useState<StampData[]>(_stampData);

  useEffect(() => {
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
            activeOpacity={1}
            disabled={data.disabled}
            onPress={() => {
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

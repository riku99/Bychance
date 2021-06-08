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
import {selectAllFlashes} from '~/stores/flashes';
import {selectChatPartner} from '~/stores/chatPartners';

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

  // 現在、対象ユーザーが自分以外のユーザーだった場合、まずnearbyUsersからそのユーザーを探し、見つからなかったらchatPartnersから探すようにしている。
  // なので、chatPartnersからFlashの画面を開いてももしnearbyUsersに同じユーザーがいる場合はそちらのデータが優先して取られる
  // これは基本的にchatPartnersとnearbyUsersでは後者の方が更新される頻度が高いので今のところ基本的に問題ない
  // ただ、今後厳密にユーザーを取得したくなったら、調整する必要が出てくる
  const stampValues = useSelector((state: RootState) => {
    if (userId === myId) {
      return selectAllFlashes(state).find((f) => f.id === flash.id)?.stamps;
    }

    const fromNearbyUsersStampsData = selectNearbyUser(
      state,
      userId,
    )?.flashes.entities.find((e) => e.id === flash.id)?.stamps;

    if (fromNearbyUsersStampsData) {
      return fromNearbyUsersStampsData;
    }

    const fromChatPartnersStampsData = selectChatPartner(
      state,
      userId,
    )?.flashes.entities.find((e) => e.id === flash.id)?.stamps;

    return fromChatPartnersStampsData;
  }, shallowEqual);

  const _stampData: StampData[] = useMemo(() => {
    return [
      {
        label: '👍',
        value: 'thumbsUp',
        number: stampValues ? stampValues.thumbsUp.number : 0,
        disabled: stampValues
          ? stampValues.thumbsUp.userIds.includes(myId)
          : false,
      },
      {
        label: '優勝',
        value: 'yusyo',
        number: stampValues ? stampValues.yusyo.number : 0,
        disabled: stampValues
          ? stampValues.yusyo.userIds.includes(myId)
          : false,
        style: {
          fontFamily: 'Hiragino Sans',
          fontWeight: '700',
        },
      },
      {
        label: 'シンプルに\n良い',
        value: 'yoi',
        number: stampValues ? stampValues.yoi.number : 0,
        disabled: stampValues ? stampValues.yoi.userIds.includes(myId) : false,
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
        number: stampValues ? stampValues.itibann.number : 0,
        disabled: stampValues
          ? stampValues.itibann.userIds.includes(myId)
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
        number: stampValues ? stampValues.seikai.number : 0,
        disabled: stampValues
          ? stampValues.seikai.userIds.includes(myId)
          : false,
        style: {
          fontSize: 11,
          fontWeight: '700',
          color: '#004cff',
        },
      },
    ];
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

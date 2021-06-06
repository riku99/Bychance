import React, {useCallback, useMemo} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  TextStyle,
} from 'react-native';

import {createFlashStampThunk} from '~/apis/flashStamps/createFlashStamp';
import {useCustomDispatch} from '~/hooks/stores/dispatch';
import {Flash} from '~/stores/flashes';

type StampData = {
  label: string;
  value: string;
  number: number;
  style?: TextStyle;
};

type Props = {
  flash: Flash;
};

export const Stamps = React.memo(({flash}: Props) => {
  const {thumbsUp, yusyo, yoi, itibann, seikai} = useMemo(() => flash.stamps, [
    flash.stamps,
  ]);
  const stampData: StampData[] = useMemo(() => {
    return [
      {
        label: '👍',
        value: 'thumbsUp',
        number: thumbsUp.number,
      },
      {
        label: '優勝',
        value: 'yusyo',
        number: yusyo.number,
        style: {
          fontFamily: 'Hiragino Sans',
          fontWeight: '700',
        },
      },
      {
        label: 'シンプルに\n良い',
        value: 'yoi',
        number: yoi.number,
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
        style: {
          fontSize: 11,
          fontWeight: '700',
          color: '#004cff',
        },
      },
    ];
  }, [thumbsUp, yusyo, yoi, itibann, seikai]);

  const dispatch = useCustomDispatch();

  const createStamp = useCallback(
    async ({value}: {value: string}) => {
      await dispatch(createFlashStampThunk({flashId: flash.id, value}));
    },
    [dispatch, flash.id],
  );

  return (
    <View style={styles.container}>
      {stampData.map((data) => {
        return (
          <TouchableOpacity
            style={styles.stamp}
            key={data.label}
            activeOpacity={0.7}
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
    backgroundColor: "backgroundColor: 'rgba(133,133,133,0.85)",
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

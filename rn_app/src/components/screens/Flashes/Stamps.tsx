import React, {useMemo} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  TextStyle,
} from 'react-native';

type StampData = {
  type: 'emoji' | 'image';
  content: string;
  number: number;
  style?: TextStyle;
};

type Props = {};

export const Stamps = React.memo(() => {
  const stampData: StampData[] = useMemo(() => {
    return [
      {
        type: 'emoji',
        content: '👍',
        number: 4,
      },
      {
        type: 'emoji',
        content: '優勝',
        number: 10,
        style: {
          fontFamily: 'Hiragino Sans',
          fontWeight: '700',
        },
      },
      {
        type: 'emoji',
        content: 'シンプルに\n良い',
        number: 2,
        style: {
          fontSize: 9.5,
          fontFamily: 'Hiragino Sans',
          fontWeight: '700',
          color: 'pink',
        },
      },
      {
        type: 'emoji',
        content: 'お前が1番',
        number: 168,
        style: {
          fontSize: 11,
          fontWeight: '700',
          color: '#ffae00',
        },
      },
      {
        type: 'emoji',
        content: '見て正解',
        number: 1,
        style: {
          fontSize: 11,
          fontWeight: '700',
          color: '#004cff',
        },
      },
    ];
  }, []);

  return (
    <View style={styles.container}>
      {stampData.map((data) => {
        return (
          <TouchableOpacity
            style={styles.stamp}
            key={data.content}
            activeOpacity={0.7}>
            {data.type === 'emoji' ? (
              <Text style={[styles.stampText, {...data.style}]}>
                {data.content}
              </Text>
            ) : (
              <></>
            )}
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
    fontSize: 13,
    color: 'white',
    fontWeight: 'bold',
  },
});

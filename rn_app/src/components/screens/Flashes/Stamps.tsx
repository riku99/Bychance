import React, {useMemo} from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';

type StampData = {
  type: 'emoji' | 'image';
  content: string;
  number: number;
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
    ];
  }, []);

  return (
    <View style={styles.container}>
      {stampData.map((data, i) => {
        return (
          <TouchableOpacity
            style={styles.stamp}
            key={data.content}
            activeOpacity={0.7}>
            {data.type === 'emoji' ? (
              <Text style={styles.stampText}>{data.content}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stamp: {
    backgroundColor: "backgroundColor: 'rgba(133,133,133,0.85)",
    width: 64,
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
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
  },
});

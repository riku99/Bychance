import React, {ComponentProps} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';

import {SkeltonLoadingView} from '~/components/utils/SkeltonLoadingView';

export const Skelton = () => {
  return (
    <SkeltonLoadingView>
      <View style={styles.image} />
      <View style={styles.title} />
      <View style={styles.title2} />
      <View style={styles.avataAndNameContainer}>
        <View style={styles.avatar} />
        <View style={styles.name} />
      </View>
    </SkeltonLoadingView>
  );
};

type _Props = {loop: number} & ComponentProps<typeof View>;

export const SkeltonList = ({loop, ...props}: _Props) => {
  const render = () => {
    const l = [];
    for (let i = 0; i < loop; i++) {
      l.push(
        <View key={i} style={{marginTop: i !== 0 ? 20 : 0}}>
          <Skelton />
        </View>,
      );
    }
    return l;
  };

  return <View style={props.style}>{render()}</View>;
};

const {width} = Dimensions.get('screen');
const imageHeight = (width / 3) * 1.3;

const styles = StyleSheet.create({
  image: {
    height: imageHeight,
  },
  title: {
    marginTop: 15,
    height: 25,
  },
  title2: {
    marginTop: 10,
    height: 25,
    width: '70%',
  },
  avataAndNameContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 30,
  },
  name: {
    height: 20,
    width: 100,
    marginLeft: 10,
  },
});

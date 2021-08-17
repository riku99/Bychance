import React, {useRef, useEffect} from 'react';
import {View, StyleSheet, Dimensions, Animated} from 'react-native';

import {FlashesData} from '~/stores/types';

type Props = {
  flashes: {
    id: number;
    source: string;
    sourceType: 'image' | 'video';
    createdAt: string;
    viewed: {userId: string}[];
  }[];
  entityLength: number;
  alreadyViewedLength: number;
  progressAnim: {[key: number]: Animated.Value};
  progressBarWidth: number;
  currentProgressBar: React.MutableRefObject<number>;
  firstEntitiesLength: React.MutableRefObject<number>;
};

export const ProgressBar = ({
  flashes,
  entityLength,
  alreadyViewedLength,
  progressAnim,
  progressBarWidth,
  currentProgressBar,
  firstEntitiesLength,
}: Props) => {
  const finishFirstRender = useRef(false);

  useEffect(() => {
    finishFirstRender.current = true;
  });

  const setAnimValue = (i: number) => {
    // 初回レンダリングの場合
    if (!finishFirstRender.current) {
      if (i < alreadyViewedLength && alreadyViewedLength !== entityLength) {
        progressAnim[i] = new Animated.Value(0);
      } else {
        progressAnim[i] = new Animated.Value(-progressBarWidth);
      }
    }
    // アイテムが追加された場合
    if (entityLength > firstEntitiesLength.current) {
      progressAnim[entityLength - 1] = new Animated.Value(-progressBarWidth);
    }
    // アイテムが削除された場合
    if (entityLength < firstEntitiesLength.current) {
      // 削除されたアイテムが最後のものだった場合
      if (currentProgressBar.current === entityLength) {
        currentProgressBar.current -= 1;
      }
      // この要素(f)が削除されたアイテムよりも後にある場合
      if (i >= currentProgressBar.current) {
        progressAnim[i] = new Animated.Value(-progressBarWidth);
      }
    }
  };

  return (
    <View style={styles.progressBarConteiner}>
      {flashes.map((f, i) => {
        setAnimValue(i);
        return (
          <View
            key={f.id}
            style={{
              ...styles.progressBar,
              width: progressBarWidth,
            }}>
            <Animated.View
              style={{
                ...styles.animatedProgressBar,
                width: progressBarWidth,
                transform: [
                  {
                    translateX: progressAnim[i],
                  },
                ],
              }}
            />
          </View>
        );
      })}
    </View>
  );
};

const {width} = Dimensions.get('window');

const MAX_PROGRESS_BAR = width - 20;

const styles = StyleSheet.create({
  progressBarConteiner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressBar: {
    width: MAX_PROGRESS_BAR,
    height: 3,
    marginTop: 8,
    borderRadius: 5,
    backgroundColor: '#bdbdbd',
    overflow: 'hidden',
  },
  animatedProgressBar: {
    height: 3,
    borderRadius: 5,
    backgroundColor: 'white',
  },
});

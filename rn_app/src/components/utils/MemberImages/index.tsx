import React from 'react';
import {View, StyleSheet, Dimensions, StyleProp, ViewStyle} from 'react-native';

import {UserAvatar} from '~/components/utils/Avatar';

type Props = {
  memberImages: (string | null)[];
  onPress?: () => void;
  layout?: {
    containerWidth: number;
    paddingH: number;
    imageLeft: number;
    oneLineItems: number;
  };
  containerStyle?: StyleProp<ViewStyle>;
};

export const MemberImages = React.memo(
  ({memberImages, onPress, layout, containerStyle}: Props) => {
    const imageWidth = layout
      ? (layout.containerWidth - layout.paddingH * 2) / layout.oneLineItems -
        layout.imageLeft
      : defaultImageWidth;

    const paddingH = layout ? layout.paddingH : defaultPaddingH;

    const oneLineItems = layout ? layout.oneLineItems : defaultOneLineItems;

    const imageLeft = layout ? layout.imageLeft : defaultImageLeft;

    return (
      <View
        style={[styles.wrap, {paddingHorizontal: paddingH}, containerStyle]}>
        {memberImages.map((u, i) => (
          <UserAvatar
            image={u}
            size={imageWidth}
            containerStyle={[
              styles.avatarContainer,
              {
                marginLeft: i % oneLineItems !== 0 ? imageLeft : undefined,
              },
            ]}
            key={i}
            onPress={() => {
              if (onPress) {
                onPress();
              }
            }}
          />
        ))}
      </View>
    );
  },
);

const {width} = Dimensions.get('screen');
const defaultPaddingH = 10;
const defaultImageLeft = 10;
const defaultOneLineItems = 6;
const defaultImageWidth =
  (width - defaultPaddingH * 2) / defaultOneLineItems - defaultImageLeft;

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  avatarContainer: {
    marginTop: 10,
  },
});

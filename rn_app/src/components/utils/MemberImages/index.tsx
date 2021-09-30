import React from 'react';
import {View, StyleSheet, Dimensions, StyleProp, ViewStyle} from 'react-native';

import {UserAvatar} from '~/components/utils/Avatar';
import {SkeltonLoadingView} from '~/components/utils/SkeltonLoadingView';

type Props = {
  data: {
    id: string;
    imageUrl: string | null;
  }[];
  onPress?: (userId: string) => void;
  layout?: {
    containerWidth: number;
    paddingH: number;
    imageLeft: number;
    oneLineItems: number;
  };
  containerStyle?: StyleProp<ViewStyle>;
  skeltonLoading?: boolean;
};

export const MemberImages = React.memo(
  ({data, onPress, layout, containerStyle, skeltonLoading}: Props) => {
    const imageWidth = layout
      ? (layout.containerWidth - layout.paddingH * 2) / layout.oneLineItems -
        layout.imageLeft
      : defaultImageWidth;

    const paddingH = layout ? layout.paddingH : defaultPaddingH;

    const oneLineItems = layout ? layout.oneLineItems : defaultOneLineItems;

    const imageLeft = layout ? layout.imageLeft : defaultImageLeft;

    let skeltonArray: JSX.Element[] = [];
    for (let i = 0; i < 6; i++) {
      skeltonArray.push(
        <View
          key={i}
          style={[
            styles.avatarContainer,
            {
              width: imageWidth,
              height: imageWidth,
              borderRadius: imageWidth,
              marginLeft: i % oneLineItems !== 0 ? imageLeft : undefined,
            },
          ]}
        />,
      );
    }

    if (skeltonLoading) {
      return (
        <SkeltonLoadingView>
          <View
            style={[
              styles.wrap,
              {paddingHorizontal: paddingH},
              containerStyle,
            ]}>
            {skeltonArray.map((s) => s)}
          </View>
        </SkeltonLoadingView>
      );
    }

    return (
      <View
        style={[styles.wrap, {paddingHorizontal: paddingH}, containerStyle]}>
        {data.map((u, i) => (
          <UserAvatar
            image={u.imageUrl}
            size={imageWidth}
            containerStyle={[
              styles.avatarContainer,
              {
                marginLeft: i % oneLineItems !== 0 ? imageLeft : undefined,
              },
            ]}
            key={u.id}
            onPress={() => {
              if (onPress) {
                onPress(u.id);
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

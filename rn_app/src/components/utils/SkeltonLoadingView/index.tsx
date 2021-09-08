import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import {normalStyles} from '~/constants/styles';

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const SkeltonLoadingView = React.memo(({children}: Props) => {
  return (
    <SkeletonPlaceholder
      backgroundColor={normalStyles.imageBackGroundColor}
      speed={1000}
      highlightColor={'#fcfcfc'}>
      {children}
    </SkeletonPlaceholder>
  );
});

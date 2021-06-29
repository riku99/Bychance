import React from 'react';
import {Dimensions} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {PathType} from '@benjeau/react-native-draw/src/types';

export type DrawPath = Omit<PathType, 'data'>[];

type Props = {
  paths: PathType[];
};

export const SVGRenderer = React.memo(({paths}: Props) => {
  return (
    <Svg height={height} width={width}>
      {paths.map(({color, path, thickness, opacity}, i) => (
        <Path
          key={i}
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          opacity={opacity}
          strokeLinejoin="round"
        />
      ))}
    </Svg>
  );
});

const {height, width} = Dimensions.get('screen');

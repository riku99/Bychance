import React from 'react';
import {Dimensions} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {PathType} from '@benjeau/react-native-draw/src/types';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

export type DrawPath = Omit<PathType, 'data'>[];

type Props = {
  paths: PathType[];
  onPanGesture?: (e: PanGestureHandlerGestureEvent) => void;
  onPanGestureStateChange?: (e: PanGestureHandlerGestureEvent) => void;
};

export const SVGRenderer = React.memo(
  ({paths, onPanGesture, onPanGestureStateChange}: Props) => {
    return (
      <PanGestureHandler
        onGestureEvent={onPanGesture}
        onHandlerStateChange={onPanGestureStateChange}>
        <Svg height={height} width={width} disabled>
          {paths.map(({color, path, thickness, opacity}, i) => (
            <Path
              pointerEvents="auto"
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
      </PanGestureHandler>
    );
  },
);

const {height, width} = Dimensions.get('screen');

import React, {useRef} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Button} from 'react-native-elements';
import Slider from '@react-native-community/slider';
import {Draw, DrawRef} from '@benjeau/react-native-draw';
import {PathType} from '@benjeau/react-native-draw/src/types';
import {HorizontalColorPalette} from '~/components/utils/ColorPalette';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {WideRangeSourceContainer} from '~/components/utils/WideRangeSourceContainer';

type Props = {
  sketchMode: boolean;
  setScetchMode: (s: boolean) => void;
  setDrawPaths: React.Dispatch<React.SetStateAction<PathType[]>>;
};

export const SketchCanvas = React.memo(
  ({sketchMode, setScetchMode, setDrawPaths}: Props) => {
    const drawRef = useRef<DrawRef>(null);

    const onCompletePress = () => {
      if (drawRef.current) {
        const paths = drawRef.current.getPaths();
        setDrawPaths((c) => [...c, ...paths]);
      }
      setScetchMode(false);
    };

    const {top, bottom} = useSafeAreaInsets();

    return (
      <View style={styles.container}>
        <View style={{top}}>
          <WideRangeSourceContainer>
            <Draw
              ref={drawRef}
              simplifyOptions={{
                simplifyPaths: false,
              }}
              initialValues={{
                color: '#B644D0',
                thickness: 3,
                opacity: 0.5,
                paths: [],
              }}
              hideButton={true}
              canvasStyle={styles.canvas}
            />
          </WideRangeSourceContainer>
        </View>

        <View style={[styles.topButtonContainer, {top}]}>
          <Button
            title="1つ戻す"
            activeOpacity={1}
            buttonStyle={styles.topButton}
            titleStyle={{fontSize: 20, fontWeight: 'bold'}}
            onPress={() => {
              if (drawRef.current) {
                drawRef.current.undo();
              }
            }}
          />
          <Button
            title="完了"
            activeOpacity={1}
            buttonStyle={styles.topButton}
            titleStyle={{fontSize: 20, fontWeight: 'bold'}}
            onPress={onCompletePress}
          />
        </View>

        <View style={styles.sliderContainer}>
          <Slider
            style={{width: 200, height: 20}}
            value={5}
            minimumValue={1}
            maximumValue={20}
            step={0.3}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
            onValueChange={(v) => {}}
          />
        </View>

        <View style={[styles.paletteContainer, {bottom: bottom + 5}]}>
          <HorizontalColorPalette />
        </View>
      </View>
    );
  },
);

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width,
    height,
    alignItems: 'center',
  },
  canvasContainer: {
    backgroundColor: 'transparent',
  },
  canvas: {
    height: '100%',
    width: '100%',
    elevation: 0,
    backgroundColor: 'transparent',
  },
  paletteContainer: {
    position: 'absolute',
    bottom: 30,
  },
  functionButton: {
    position: 'absolute',
    top: 100,
    left: 100,
    width: 50,
    height: 50,
    borderRadius: 5,
    backgroundColor: 'red',
  },
  strokeComponent: {
    borderWidth: 3,
    borderColor: 'white',
  },
  strokeColorButton: {
    marginHorizontal: 5,
    marginVertical: 30,
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  strokeWidthButton: {
    marginHorizontal: 2.5,
    marginVertical: 20,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#39579A',
  },
  sliderContainer: {
    transform: [{rotate: '-90deg'}],
    position: 'absolute',
    top: '45%',
    left: -70,
  },
  topButtonContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    justifyContent: 'space-between',
  },
  topButton: {backgroundColor: 'transparent'},
});

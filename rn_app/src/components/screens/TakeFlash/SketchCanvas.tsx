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
  setScetchMode: (s: boolean) => void;
  setDrawPaths: React.Dispatch<React.SetStateAction<PathType[]>>;
};

export const SketchCanvas = React.memo(
  ({setScetchMode, setDrawPaths}: Props) => {
    const drawRef = useRef<DrawRef>(null);

    const {top, bottom} = useSafeAreaInsets();

    const onCompletePress = () => {
      if (drawRef.current) {
        const paths = drawRef.current.getPaths();
        setDrawPaths((c) => [...c, ...paths]);
      }
      setScetchMode(false);
    };

    const onSelectColor = (c: string) => {
      if (drawRef.current) {
        drawRef.current.setColor(c);
      }
    };

    const onChangeThinkness = (n: number) => {
      if (drawRef.current) {
        drawRef.current.setThickness(n);
      }
    };

    const onBackButtonPress = () => {
      if (drawRef.current) {
        const paths = drawRef.current.getPaths();
        if (paths.length) {
          drawRef.current.undo();
        } else {
          setDrawPaths((c) => {
            if (c.length) {
              return c.filter((p, i) => i !== c.length - 1);
            } else {
              return c;
            }
          });
        }
      }
    };

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
                color: 'white',
                thickness: initialThickness,
                opacity: 1,
                paths: [],
              }}
              hideBottom={true}
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
            onPress={onBackButtonPress}
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
            value={initialThickness}
            minimumValue={1}
            maximumValue={20}
            step={0.3}
            maximumTrackTintColor="white"
            onValueChange={onChangeThinkness}
          />
        </View>

        <View style={[styles.paletteContainer, {bottom: bottom + 15}]}>
          <HorizontalColorPalette onSelect={(color) => onSelectColor(color)} />
        </View>
      </View>
    );
  },
);

const {width, height} = Dimensions.get('window');

const initialThickness = 5;

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

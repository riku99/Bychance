import React, {useRef} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Button} from 'react-native-elements';
import RNImageEditor from '@wwimmo/react-native-sketch-canvas';
import Slider from '@react-native-community/slider';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  sketchMode: boolean;
  setScetchMode: (s: boolean) => void;
};

export const SketchCanvas = ({sketchMode, setScetchMode}: Props) => {
  const canvasRef = useRef<RNImageEditor>(null);
  const {top} = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <RNImageEditor
        ref={canvasRef}
        touchEnabled={sketchMode}
        containerStyle={styles.canvasContainer}
        canvasStyle={styles.canvas}
        defaultStrokeIndex={0}
        strokeComponent={(color) => {
          return (
            <>
              {sketchMode && (
                <View
                  style={[
                    {
                      backgroundColor: color,
                      borderWidth: 3,
                      borderColor: 'white',
                    },
                    styles.strokeColorButton,
                  ]}
                />
              )}
            </>
          );
        }}
        strokeSelectedComponent={(color) => {
          return (
            <>
              {sketchMode && (
                <View
                  style={[
                    {backgroundColor: color, borderWidth: 2},
                    styles.strokeColorButton,
                  ]}
                />
              )}
            </>
          );
        }}
        defaultStrokeWidth={5}
      />
      {sketchMode && (
        <>
          <View style={[styles.topButtonContainer, {top}]}>
            <Button
              title="1つ戻す"
              buttonStyle={styles.topButton}
              titleStyle={{fontSize: 20}}
              onPress={() => {
                if (canvasRef.current) {
                  canvasRef.current.undo();
                }
              }}
            />
            <Button
              title="完了"
              buttonStyle={styles.topButton}
              titleStyle={{fontSize: 20}}
              onPress={() => setScetchMode(false)}
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
              onValueChange={(v) => {
                if (canvasRef.current) {
                  canvasRef.current._nextStrokeWidth(v);
                }
              }}
            />
          </View>
        </>
      )}
    </View>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  canvasContainer: {
    backgroundColor: 'transparent',
  },
  canvas: {
    backgroundColor: 'transparent',
    flex: 1,
    width,
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

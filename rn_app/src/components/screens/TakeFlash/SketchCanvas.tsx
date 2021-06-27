import React, {useRef} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Button} from 'react-native-elements';
import RNImageEditor from '@wwimmo/react-native-sketch-canvas';
import Slider from '@react-native-community/slider';

type Props = {
  sketchMode: boolean;
  setScetchMode: (s: boolean) => void;
};

export const SketchCanvas = React.memo(({sketchMode, setScetchMode}: Props) => {
  const canvasRef = useRef<RNImageEditor>(null);

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
                    },
                    styles.strokeColorButton,
                    styles.strokeComponent,
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
          <View style={[styles.topButtonContainer]}>
            <Button
              title="1つ戻す"
              activeOpacity={1}
              buttonStyle={styles.topButton}
              titleStyle={{fontSize: 20, fontWeight: 'bold'}}
              onPress={() => {
                if (canvasRef.current) {
                  canvasRef.current.undo();
                }
              }}
            />
            <Button
              title="完了"
              activeOpacity={1}
              buttonStyle={styles.topButton}
              titleStyle={{fontSize: 20, fontWeight: 'bold'}}
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
                  // @ts-ignore ._nextStrokeWidthはライブラリforkして作成したオリジナル(?)メソッド
                  canvasRef.current._nextStrokeWidth(v);
                }
              }}
            />
          </View>
        </>
      )}
    </View>
  );
});

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
    top: 0,
  },
  topButton: {backgroundColor: 'transparent'},
});

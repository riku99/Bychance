import React, {useRef} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Button} from 'react-native-elements';
import Slider from '@react-native-community/slider';
import {Draw, DrawRef} from '@benjeau/react-native-draw';
import {PathType} from '@benjeau/react-native-draw/src/types';

type Props = {
  sketchMode: boolean;
  setScetchMode: (s: boolean) => void;
  setDrawPaths: (p: PathType[]) => void;
};

export const SketchCanvas = React.memo(
  ({sketchMode, setScetchMode, setDrawPaths}: Props) => {
    const drawRef = useRef<DrawRef>(null);

    const onCompletePress = () => {
      if (drawRef.current) {
        const paths = drawRef.current.getPaths;
        setDrawPaths(paths);
      }
      setScetchMode(false);
    };

    return (
      <View style={styles.container}>
        <Draw
          height={height}
          width={width}
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
          canvasStyle={{elevation: 0, backgroundColor: 'transparent'}}
        />
        {/* <RNImageEditor
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
      )} */}
        {sketchMode && (
          <>
            <View style={[styles.topButtonContainer]}>
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
              {/* <Slider
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
            /> */}
            </View>
          </>
        )}
      </View>
    );
  },
);

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    // top: 0,
    // bottom: 0,
    // left: 0,
    // right: 0,
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

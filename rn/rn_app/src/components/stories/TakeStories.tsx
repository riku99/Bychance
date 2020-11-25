import React, {useRef} from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Button} from 'react-native-elements';
import MIcon from 'react-native-vector-icons/MaterialIcons';

export const TakeStories = () => {
  const cameraRef = useRef<RNCamera>(null);

  const takeVideo = async () => {
    if (cameraRef.current) {
      const options = {quality: 0.9, base64: true};
      const data = await cameraRef.current.takePictureAsync(options);
    }
  };
  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
      />
      <View
        style={{
          width: '80%',
          height: '8%',
          position: 'absolute',
          bottom: 0,
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          //backgroundColor: 'red',
        }}>
        <Button
          icon={
            <MIcon
              name="enhance-photo-translate"
              size={20}
              style={{color: 'black'}}
            />
          }
          buttonStyle={styles.photoButton}
        />
      </View>
    </View>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  photoButton: {
    width: width / 8,
    height: width / 8,
    borderRadius: width / 8,
    borderColor: 'white',
    borderWidth: 1,
    backgroundColor: 'white',
  },
});

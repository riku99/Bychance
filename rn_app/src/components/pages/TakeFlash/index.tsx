import React, {useState, useRef, useCallback} from 'react';
import CameraRoll from '@react-native-community/cameraroll';
import ImagePicker from 'react-native-image-picker';
import {RNCamera} from 'react-native-camera';
import {View} from 'react-native';

import {TakeFlash} from './TakeFlash';
import {EditImage} from './EditImage';

export const TakeFlashPage = () => {
  const [targetPhoto, setTargetPhoto] = useState<{
    base64: string;
    uri: string;
  } | null>(null);
  const [targetVideo, setTargetVideo] = useState<{uri: string} | null>(null);
  const [recordingVideo, setRecordingVideo] = useState(false);

  const cameraRef = useRef<RNCamera>(null);

  const takePhoto = async () => {
    if (cameraRef.current) {
      const options = {quality: 0.1, base64: true};
      const data = await cameraRef.current.takePictureAsync(options);
      if (data && data.base64) {
        setTargetPhoto({base64: data.base64, uri: data.uri});
      }
    }
  };

  const takeVideo = async () => {
    if (cameraRef.current) {
      const options = {quality: RNCamera.Constants.VideoQuality['720p']};
      const data = await cameraRef.current.recordAsync(options);
      console.log(data.uri);
      setTargetVideo({uri: data.uri});
    }
  };

  const stopVideo = () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
  };

  const saveDataToCameraRoll = async (uri: string) => {
    try {
      await CameraRoll.save(uri);
      return;
    } catch {}
  };

  const pickImageOrVideo = useCallback(() => {
    ImagePicker.launchImageLibrary(
      {mediaType: 'mixed', quality: 1}, // 画像選択から表示まで遅いの気になったらquality変える
      (response) => {
        if (response.didCancel) {
          return;
        }
        if (response.type) {
          setTargetPhoto({uri: response.uri, base64: response.data});
        } else {
          setTargetVideo({uri: response.uri});
        }
      },
    );
  }, []);

  if (!targetPhoto && !targetVideo) {
    return (
      <TakeFlash
        cameraRef={cameraRef}
        targetPhoto={targetPhoto}
        targetVideo={targetVideo}
        takePhoto={takePhoto}
        takeVideo={takeVideo}
        stopVideo={stopVideo}
        saveDataToCameraRoll={saveDataToCameraRoll}
        pickImageOrVideo={pickImageOrVideo}
        recordingVideo={recordingVideo}
        setRecordingVideo={setRecordingVideo}
      />
    );
  } else if (targetPhoto && !targetVideo && !recordingVideo) {
    return <EditImage source={{type: 'image', ...targetPhoto}} />;
  } else if (!targetPhoto && targetVideo && !recordingVideo) {
    return <EditImage source={{type: 'video', ...targetVideo}} />; // videoのソース型かえる
  }
};

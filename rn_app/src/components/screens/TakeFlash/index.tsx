import React, {useState, useRef, useCallback} from 'react';
import CameraRoll from '@react-native-community/cameraroll';
import ImagePicker from 'react-native-image-picker';
import {RNCamera} from 'react-native-camera';

import {TakeFlash} from './TakeFlash';
import {EditImage} from './EditImage';

const takePhotoOptions = {quality: 0.5, base64: true};
const takeVideoOptions = {quality: RNCamera.Constants.VideoQuality['720p']};

export const TakeFlashPage = () => {
  const [targetPhoto, setTargetPhoto] = useState<{
    base64: string;
    uri: string;
  } | null>(null);
  const [targetVideo, setTargetVideo] = useState<{uri: string} | null>(null);
  const [recordingVideo, setRecordingVideo] = useState(false);

  const cameraRef = useRef<RNCamera>(null);

  const [loading, setLoading] = useState(false);

  const takePhoto = async () => {
    if (cameraRef.current) {
      const data = await cameraRef.current.takePictureAsync(takePhotoOptions);
      if (data && data.base64) {
        setTargetPhoto({base64: data.base64, uri: data.uri});
      }
    }
  };

  const takeVideo = async () => {
    if (cameraRef.current) {
      const data = await cameraRef.current.recordAsync(takeVideoOptions);
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
      {mediaType: 'mixed', quality: 0.5}, // 画像選択から表示まで遅いの気になったらquality変える
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
        loading={loading}
      />
    );
  } else if (targetPhoto && !targetVideo && !recordingVideo) {
    return <EditImage source={{type: 'image', ...targetPhoto}} />;
  } else if (!targetPhoto && targetVideo && !recordingVideo) {
    return <EditImage source={{type: 'video', ...targetVideo}} />;
  } else {
    return <></>;
  }
};

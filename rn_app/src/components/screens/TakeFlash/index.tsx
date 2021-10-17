import React, {useState, useRef, useCallback, useEffect} from 'react';
import {Alert} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {RNCamera} from 'react-native-camera';
import {RNToasty} from 'react-native-toasty';

import {TakeFlash} from './TakeFlash';
import {EditSource} from './EditSource';
import {useVideoEditDescription} from '~/hooks/experiences';

const takePhotoOptions = {quality: 0.5, base64: true};
const takeVideoOptions = {
  quality: RNCamera.Constants.VideoQuality['720p'],
  maxDuration: 15,
};

const videoEditDescriptionText =
  '現在動画に関しては撮影したものを保存、投稿はできますが編集、加工ができません。🙇‍♂️🙇‍♀\nなのでインスタとかで加工したものを使ってください!';

export const TakeFlashScreen = React.memo(() => {
  const [targetPhoto, setTargetPhoto] = useState<{
    uri: string;
  } | null>(null);
  const [targetVideo, setTargetVideo] = useState<{uri: string} | null>(null);
  const [recordingVideo, setRecordingVideo] = useState(false);
  const cameraRef = useRef<RNCamera>(null);
  const [loading, setLoading] = useState(false);
  const {
    changeVideoEditDescription,
    currentVideoEditDesctiption,
  } = useVideoEditDescription();

  const takePhoto = useCallback(async () => {
    if (cameraRef.current) {
      const data = await cameraRef.current.takePictureAsync(takePhotoOptions);
      if (data && data.base64) {
        setTargetPhoto({uri: data.uri});
      }
      setLoading(false);
    }
  }, []);

  const takeVideo = useCallback(async () => {
    if (cameraRef.current) {
      setRecordingVideo(true);
      const data = await cameraRef.current.recordAsync(takeVideoOptions);
      setRecordingVideo(false);
      setTargetVideo({uri: data.uri});
    }
  }, []);

  const stopVideo = useCallback(() => {
    if (cameraRef.current && recordingVideo) {
      cameraRef.current.stopRecording();
    }
  }, [recordingVideo]);

  const pickImageOrVideo = useCallback(() => {
    setLoading(true);
    launchImageLibrary({mediaType: 'mixed', quality: 1}, (response) => {
      if (response.didCancel) {
        setLoading(false);
        return;
      }

      const asset = response.assets[0];
      const uri = asset.uri;
      const _type = asset.type;

      if (!uri) {
        setLoading(false);
        return;
      }

      if (_type) {
        const size = asset.fileSize;
        if (!size || size > 1000000) {
          RNToasty.Show({
            title: '1MB以下の画像にしてください',
            position: 'center',
          });
          setLoading(false);
          return;
        }
        setTargetPhoto({uri});
      } else {
        const duration = asset.duration;
        if (duration && duration > 15) {
          RNToasty.Show({
            title: '15秒以下の動画にしてください',
            position: 'center',
          });
          setLoading(false);
          return;
        }
        setTargetVideo({uri});
      }
      setLoading(false);
    });
  }, []);

  const setSourceLoading = useCallback(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    if (!currentVideoEditDesctiption) {
      Alert.alert('動画の編集について', videoEditDescriptionText, [
        {
          text: 'OK👌',
          onPress: () => changeVideoEditDescription(true),
        },
      ]);
    }
  }, [currentVideoEditDesctiption, changeVideoEditDescription]);

  if (!targetPhoto && !targetVideo) {
    return (
      <TakeFlash
        cameraRef={cameraRef}
        targetPhoto={targetPhoto}
        targetVideo={targetVideo}
        takePhoto={takePhoto}
        takeVideo={takeVideo}
        stopVideo={stopVideo}
        pickImageOrVideo={pickImageOrVideo}
        recordingVideo={recordingVideo}
        loading={loading}
        onPictureTaken={setSourceLoading}
      />
    );
  } else if (targetPhoto && !targetVideo && !recordingVideo) {
    return <EditSource source={{type: 'image', ...targetPhoto}} />;
  } else if (!targetPhoto && targetVideo && !recordingVideo) {
    return <EditSource source={{type: 'video', ...targetVideo}} />;
  } else {
    return <></>;
  }
});

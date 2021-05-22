import React, {useState, useRef, useCallback, useEffect} from 'react';
import {Alert} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {RNCamera} from 'react-native-camera';
import {useSelector} from 'react-redux';

import {TakeFlash} from './TakeFlash';
import {EditSource} from './EditSource';
import {RootState} from '~/stores';
import {changeVideoEditDescriptionThunk} from '~/apis/users/changeVideoEditDescription';
import {useCustomDispatch} from '~/hooks/stores/dispatch';

const takePhotoOptions = {quality: 0.5, base64: true};
const takeVideoOptions = {
  quality: RNCamera.Constants.VideoQuality['720p'],
  maxDuration: 3,
};

const videoEditDescriptionText =
  '現在動画に関しては撮影したものを保存、投稿はできますが編集、加工ができません。🙇‍♂️🙇‍♀\nなのでインスタとかで加工したものを使ってください!🥺🌞';

export const TakeFlashPage = () => {
  const [targetPhoto, setTargetPhoto] = useState<{
    base64: string;
    uri: string;
  } | null>(null);
  const [targetVideo, setTargetVideo] = useState<{uri: string} | null>(null);
  const [recordingVideo, setRecordingVideo] = useState(false);

  console.log(recordingVideo);

  const cameraRef = useRef<RNCamera>(null);

  const [loading, setLoading] = useState(false);

  const takePhoto = useCallback(async () => {
    if (cameraRef.current) {
      const data = await cameraRef.current.takePictureAsync(takePhotoOptions);
      if (data && data.base64) {
        setTargetPhoto({base64: data.base64, uri: data.uri});
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
    ImagePicker.launchImageLibrary(
      {mediaType: 'mixed', quality: 0.5}, // 画像選択から表示まで遅いの気になったらquality変える
      (response) => {
        if (response.didCancel) {
          setLoading(false);
          return;
        }
        if (response.type) {
          setTargetPhoto({uri: response.uri, base64: response.data});
        } else {
          setTargetVideo({uri: response.uri});
        }
        setLoading(false);
      },
    );
  }, []);

  const setSourceLoading = useCallback(() => {
    setLoading(true);
  }, []);

  const videoEditDesctiption = useSelector(
    (state: RootState) => state.userReducer.user!.videoEditDescription,
  );

  const dispatch = useCustomDispatch();

  useEffect(() => {
    if (!videoEditDesctiption) {
      Alert.alert('動画の編集について', videoEditDescriptionText, [
        {
          text: 'OK👌',
          onPress: () => dispatch(changeVideoEditDescriptionThunk(true)),
        },
        {
          text: 'しゃーなし👼',
          onPress: () => dispatch(changeVideoEditDescriptionThunk(true)),
        },
      ]);
    }
  }, [videoEditDesctiption, dispatch]);

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
};

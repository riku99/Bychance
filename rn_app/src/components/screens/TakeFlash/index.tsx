import React, {useState, useRef, useCallback, useEffect} from 'react';
import {Alert} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {RNCamera} from 'react-native-camera';
import {useSelector} from 'react-redux';
import {RNToasty} from 'react-native-toasty';

import {TakeFlash} from './TakeFlash';
import {EditSource} from './EditSource';
import {RootState} from '~/stores';
import {changeVideoEditDescriptionThunk} from '~/apis/users/changeVideoEditDescription';
import {useCustomDispatch} from '~/hooks/stores/dispatch';

const takePhotoOptions = {quality: 0.5, base64: true};
const takeVideoOptions = {
  quality: RNCamera.Constants.VideoQuality['720p'],
  maxDuration: 15,
};

const videoEditDescriptionText =
  '現在動画に関しては撮影したものを保存、投稿はできますが編集、加工ができません。🙇‍♂️🙇‍♀\nなのでインスタとかで加工したものを使ってください!🥺🌞';

export const TakeFlashPage = () => {
  const [targetPhoto, setTargetPhoto] = useState<{
    uri: string;
  } | null>(null);
  const [targetVideo, setTargetVideo] = useState<{uri: string} | null>(null);
  const [recordingVideo, setRecordingVideo] = useState(false);

  const cameraRef = useRef<RNCamera>(null);

  const [loading, setLoading] = useState(false);

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
    launchImageLibrary({mediaType: 'mixed'}, (response) => {
      if (response.didCancel) {
        setLoading(false);
        return;
      }
      if (response.uri) {
        if (response.type) {
          setTargetPhoto({uri: response.uri});
        } else {
          if (response.duration && response.duration > 15) {
            RNToasty.Show({
              title: '15秒以下の動画にしてください',
              position: 'center',
            });
            setLoading(false);
            return;
          }
          setTargetVideo({uri: response.uri});
        }
      }
      setLoading(false);
    });
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

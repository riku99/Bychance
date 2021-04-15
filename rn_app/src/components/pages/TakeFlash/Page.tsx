import React, {useEffect, useState, useRef} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import CameraRoll from '@react-native-community/cameraroll';
import fs from 'react-native-fs';
import ImagePicker from 'react-native-image-picker';
import {RNCamera} from 'react-native-camera';

import {TakeFlash} from './TakeFlash';
import {EditImage} from './EditImage';
import {AppDispatch} from '../../../stores/index';
import {creatingFlash} from '../../../stores/otherSettings';
import {createFlashThunk} from '../../../actions/flashes/createFlash';
import {displayShortMessage} from '../../../helpers/shortMessages/displayShortMessage';
import {alertSomeError} from '../../../helpers/errors/alertSomeError';

export const TakeFlashPage = () => {
  const [firstCameraRollPhoto, setFirstCameraRollPhoto] = useState<
    string | null
  >(null);
  const [targetPhoto, setTargetPhoto] = useState<{
    base64: string;
    uri: string;
  } | null>(null);
  const [targetVideo, setTargetVideo] = useState<{uri: string} | null>(null);
  const [recordingVideo, setRecordingVideo] = useState(false);

  const cameraRef = useRef<RNCamera>(null);

  useEffect(() => {
    const getPhoto = async () => {
      const photo = await CameraRoll.getPhotos({first: 1});
      setFirstCameraRollPhoto(photo.edges[0].node.image.uri);
    };
    getPhoto();
  }, []);

  const navigaiton = useNavigation();

  const dispatch: AppDispatch = useDispatch();

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

  const backScreen = () => {
    navigaiton.goBack();
  };

  const createFlash = async ({
    source,
    sourceType,
    uri,
  }: {
    source?: string;
    sourceType: 'image' | 'video';
    uri: string;
  }) => {
    dispatch(creatingFlash());
    navigaiton.goBack();
    const length = uri.lastIndexOf('.'); // 拡張子の有無。なければ-1が返される
    const ext = length !== -1 ? uri.slice(length + 1) : null; // あれば拡張子('.'以降)を取得
    const result = await dispatch(
      createFlashThunk({
        source:
          sourceType === 'image' && source
            ? source
            : await fs.readFile(uri, 'base64'),
        sourceType,
        ext: ext ? ext.toLowerCase() : null,
      }),
    );
    if (createFlashThunk.fulfilled.match(result)) {
      displayShortMessage('追加しました', 'success');
    } else {
      if (result.payload?.errorType === 'invalidError') {
        displayShortMessage(result.payload.message, 'danger');
      } else if (result.payload?.errorType === 'someError') {
        alertSomeError();
      }
    }
    dispatch(creatingFlash());
  };

  const saveDataToCameraRoll = async (uri: string) => {
    try {
      await CameraRoll.save(uri);
      return;
    } catch {}
  };

  const pickImageOrVideo = () => {
    ImagePicker.launchImageLibrary(
      {mediaType: 'mixed', quality: 0.1},
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
  };

  if (!targetPhoto && !targetVideo) {
    return (
      <TakeFlash
        cameraRef={cameraRef}
        targetPhoto={targetPhoto}
        targetVideo={targetVideo}
        takePhoto={takePhoto}
        takeVideo={takeVideo}
        stopVideo={stopVideo}
        firstCameraRollPhoto={firstCameraRollPhoto}
        goBack={backScreen}
        saveDataToCameraRoll={saveDataToCameraRoll}
        createFlash={createFlash}
        pickImageOrVideo={pickImageOrVideo}
        recordingVideo={recordingVideo}
        setRecordingVideo={setRecordingVideo}
      />
    );
  } else if (targetPhoto && !targetVideo && !recordingVideo) {
    return <EditImage source={targetPhoto} />;
  }
};

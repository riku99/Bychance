import {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import fs from 'react-native-fs';

import {createFlashThunk} from '~/thunks/flashes/createFlash';
import {creatingFlash} from '~/stores/otherSettings';
import {getExtention} from '~/utils';
import {useCustomDispatch} from '~/hooks/stores';
import {showBottomToast} from '~/stores/bottomToast';

export const useCreateFlash = () => {
  const navigation = useNavigation();
  const dispatch = useCustomDispatch();

  return useCallback(
    async ({sourceType, uri}: {sourceType: 'image' | 'video'; uri: string}) => {
      dispatch(creatingFlash());
      navigation.goBack();
      const ext = getExtention(uri);
      if (!ext) {
        dispatch(
          showBottomToast({
            data: {
              type: 'danger',
              message: '無効なデータです',
            },
          }),
        );
        return;
      }

      await dispatch(
        createFlashThunk({
          source: await fs.readFile(uri, 'base64'),
          sourceType,
          ext,
        }),
      );

      dispatch(creatingFlash());
    },
    [dispatch, navigation],
  );
};

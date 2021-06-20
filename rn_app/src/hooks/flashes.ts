import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import fs from 'react-native-fs';

import {createFlashThunk} from '~/thunks/flashes/createFlash';
import {creatingFlash} from '~/stores/otherSettings';
import {AppDispatch} from '~/stores/index';
import {displayShortMessage} from '~/helpers/topShortMessage';
import {getExtention} from '~/utils';

export const useCreateFlash = () => {
  const navigation = useNavigation();
  const dispatch: AppDispatch = useDispatch();

  return useCallback(
    async ({sourceType, uri}: {sourceType: 'image' | 'video'; uri: string}) => {
      dispatch(creatingFlash());
      navigation.goBack();
      const ext = getExtention(uri);
      if (!ext) {
        displayShortMessage('無効なデータです', 'warning');
        return;
      }
      const result = await dispatch(
        createFlashThunk({
          source: await fs.readFile(uri, 'base64'),
          sourceType,
          ext,
        }),
      );
      if (createFlashThunk.fulfilled.match(result)) {
        displayShortMessage('追加しました', 'success');
      }
      dispatch(creatingFlash());
    },
    [dispatch, navigation],
  );
};

import {useToast} from 'react-native-fast-toast';

import {useCustomDispatch} from './stores';
import {checkKeychain} from '~/helpers/credentials';
import {addBearer} from '~/helpers/requestHeaders';
import {useHandleApiErrors} from './errors';
import {useToastLoading} from './appState';

export const useApikit = () => {
  const toast = useToast();
  const dispatch = useCustomDispatch();
  const {handleApiError} = useHandleApiErrors();
  const {setToastLoading} = useToastLoading();

  return {
    toast,
    dispatch,
    checkKeychain,
    addBearer,
    handleApiError,
    setToastLoading,
  };
};

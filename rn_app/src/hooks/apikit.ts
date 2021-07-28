import {useToast} from 'react-native-fast-toast';

import {useCustomDispatch} from './stores';
import {checkKeychain} from '~/helpers/credentials';
import {addBearer} from '~/helpers/requestHeaders';
import {useHandleApiErrors} from './errors';

export const useApikit = () => {
  const toast = useToast();
  const dispatch = useCustomDispatch();
  const {handleError} = useHandleApiErrors();

  return {
    toast,
    dispatch,
    checkKeychain,
    addBearer,
    handleError,
  };
};

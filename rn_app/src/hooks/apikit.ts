import {useToast} from 'react-native-fast-toast';

import {useCustomDispatch} from './stores';
import {checkKeychain} from '~/helpers/credentials';
import {addBearer} from '~/helpers/requestHeaders';

export const useApikit = () => {
  const toast = useToast();
  const dispatch = useCustomDispatch();

  return {
    toast,
    dispatch,
    checkKeychain,
    addBearer,
  };
};

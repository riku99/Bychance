import {useToast} from 'react-native-fast-toast';
import {useNavigation} from '@react-navigation/native';

import {useCustomDispatch} from './stores';

export const useApikit = () => {
  const toast = useToast();
  const dispatch = useCustomDispatch();
  const navigation = useNavigation();

  return {
    toast,
    dispatch,
    navigation,
  };
};

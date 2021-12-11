import {IAPContext} from '~/providers/IAPProvider';
import {useContext} from 'react';

export const useIap = () => useContext(IAPContext);

import React from 'react';
import {StackNavigationProp} from '@react-navigation/stack';

import {ShowFlash} from '../../components/flashes/ShowFlash';
import {RootStackParamList} from '../../screens/Root';

type RootNavigationProp = StackNavigationProp<RootStackParamList, 'ShowFlash'>;

export const Container = () => {
  return <ShowFlash />;
};

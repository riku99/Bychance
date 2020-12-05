import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {shallowEqual, useSelector} from 'react-redux';

import {ShowFlash} from '../../components/flashes/ShowFlash';
import {RootStackParamList} from '../../screens/Root';
import {RootState} from '../../redux/index';
import {selectAllFlashes} from '../../redux/flashes';

type RootNavigationProp = StackNavigationProp<RootStackParamList, 'ShowFlash'>;

type RootRouteProp = RouteProp<RootStackParamList, 'ShowFlash'>;

type Props = {route: RootRouteProp};

export const Container = ({route}: Props) => {
  const flashes = useSelector((state: RootState) => {
    return selectAllFlashes(state);
  });

  const rootNavigation = useNavigation<RootNavigationProp>();

  const backScreen = () => {
    rootNavigation.goBack();
  };

  return (
    <ShowFlash
      navigateToGoback={backScreen}
      userInfo={route.params}
      flashes={flashes}
    />
  );
};

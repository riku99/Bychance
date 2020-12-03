import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

import {ShowFlash} from '../../components/flashes/ShowFlash';
import {RootStackParamList} from '../../screens/Root';

type RootNavigationProp = StackNavigationProp<RootStackParamList, 'ShowFlash'>;

type RootRouteProp = RouteProp<RootStackParamList, 'ShowFlash'>;

type Props = {route: RootRouteProp};

export const Container = ({route}: Props) => {
  const rootNavigation = useNavigation<RootNavigationProp>();

  const backScreen = () => {
    rootNavigation.goBack();
  };

  return <ShowFlash navigateToGoback={backScreen} userInfo={route.params} />;
};

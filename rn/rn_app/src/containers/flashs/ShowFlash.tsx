import React, {useRef, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {shallowEqual, useSelector} from 'react-redux';

import {ShowFlash} from '../../components/flashes/ShowFlash';
import {RootStackParamList} from '../../screens/Root';
import {RootState, AppDispatch} from '../../redux/index';
import {selectAllFlashes} from '../../redux/flashes';
import {deleteFlashThunk} from '../../actions/flashes';
import {flashMessage} from '../../helpers/flashMessage';

type RootNavigationProp = StackNavigationProp<RootStackParamList, 'ShowFlash'>;

type RootRouteProp = RouteProp<RootStackParamList, 'ShowFlash'>;

type Props = {route: RootRouteProp};

export const Container = ({route}: Props) => {
  const firstRender = useRef(false);

  const flashes = useSelector((state: RootState) => {
    return selectAllFlashes(state);
  }, shallowEqual);

  const rootNavigation = useNavigation<RootNavigationProp>();

  useEffect(() => {
    firstRender.current = true;
  }, []);

  const backScreen = () => {
    rootNavigation.goBack();
  };

  const dispatch: AppDispatch = useDispatch();

  const deleteFlash = async ({flashId}: {flashId: number}) => {
    await dispatch(deleteFlashThunk({flashId}));
    flashMessage('削除しました', 'success');
  };

  return (
    <ShowFlash
      deleteFlash={deleteFlash}
      navigateToGoback={backScreen}
      userInfo={route.params}
      firstRender={firstRender}
      flashes={flashes}
    />
  );
};

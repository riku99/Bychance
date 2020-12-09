import React, {useRef, useEffect} from 'react';
import {Alert} from 'react-native';
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
import {alertSomeError} from '../../helpers/error';

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
    Alert.alert('本当に削除してもよろしいですか?', '', [
      {
        text: 'はい',
        onPress: async () => {
          const result = await dispatch(deleteFlashThunk({flashId}));
          if (deleteFlashThunk.fulfilled.match(result)) {
            flashMessage('削除しました', 'success');
          } else {
            if (result.payload && result.payload.errorType === 'invalidError') {
              flashMessage(result.payload.message, 'danger');
            } else if (
              result.payload &&
              result.payload.errorType === 'someError'
            ) {
              alertSomeError();
            }
          }
        },
      },
      {
        text: 'いいえ',
        onPress: () => {
          return;
        },
      },
    ]);
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

import React, {useRef, useEffect} from 'react';
import {Alert} from 'react-native';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {Modalize} from 'react-native-modalize';

import {ShowFlash} from '../../components/flashes/ShowFlash';
import {RootStackParamList} from '../../screens/Root';
import {RootState, AppDispatch} from '../../redux/index';
import {deleteFlashThunk} from '../../actions/flashes';
import {flashMessage} from '../../helpers/flashMessage';
import {alertSomeError} from '../../helpers/error';

type RootNavigationProp = StackNavigationProp<RootStackParamList, 'ShowFlash'>;

type RootRouteProp = RouteProp<RootStackParamList, 'ShowFlash'>;

type Props = {route: RootRouteProp};

export const Container = ({route}: Props) => {
  const routePropsData = route.params;

  const getUserInfo = () => {
    switch (routePropsData.type) {
      case 'fromProfilePage':
        return {
          userId: routePropsData.userId,
          userName: routePropsData.userName,
          userImage: routePropsData.userImage,
        };
      case 'fromSearchPage':
        return {
          userId: routePropsData.displayedList[routePropsData.index].id,
          userName: routePropsData.displayedList[routePropsData.index].name,
          userImage: routePropsData.displayedList[routePropsData.index].image,
        };
    }
  };

  const firstRender = useRef(false);
  const modalizeRef = useRef<Modalize>(null);

  const referenceId = useSelector((state: RootState) => {
    return state.userReducer.user!.id;
  });

  const creatingFlash = useSelector((state: RootState) => {
    return state.indexReducer.creatingFlash;
  });

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
            modalizeRef.current?.close();
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
      creatingFlash={creatingFlash}
      navigateToGoback={backScreen}
      userInfo={getUserInfo()}
      firstRender={firstRender}
      modalizeRef={modalizeRef}
      flashes={
        routePropsData.type === 'fromProfilePage'
          ? routePropsData.flashes
          : routePropsData.displayedList[routePropsData.index].flashes
      }
      referenceId={referenceId}
    />
  );
};

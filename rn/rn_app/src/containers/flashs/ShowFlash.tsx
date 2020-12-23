import React, {useRef, useEffect} from 'react';
import {Alert} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {Modalize} from 'react-native-modalize';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {ShowFlash, FlashesWithUser} from '../../components/flashes/ShowFlash';
import {RootState, AppDispatch} from '../../redux/index';
import {
  deleteFlashThunk,
  createAlreadyViewdFlashThunk,
} from '../../actions/flashes';
import {flashMessage} from '../../helpers/flashMessage';
import {alertSomeError} from '../../helpers/error';
import {selectAllFlashes} from '../../redux/flashes';
import {FlashStackParamList} from '../../screens/Flash';

type FlashStackNavigationProp = StackNavigationProp<
  FlashStackParamList,
  'Flashes'
>;

type Props = {
  flashData: FlashesWithUser;
  isDisplayed: boolean;
  scrollToNextOrBackScreen: () => void;
  goBackScreen: () => void;
};

export const Container = ({
  flashData,
  isDisplayed,
  scrollToNextOrBackScreen,
  goBackScreen,
}: Props) => {
  const firstRender = useRef(false);
  const modalizeRef = useRef<Modalize>(null);

  const referenceId = useSelector((state: RootState) => {
    return state.userReducer.user!.id;
  });

  const flashes = useSelector((state: RootState) => {
    return selectAllFlashes(state);
  }, shallowEqual);

  const creatingFlash = useSelector((state: RootState) => {
    return state.indexReducer.creatingFlash;
  });

  useEffect(() => {
    firstRender.current = true;
  }, []);

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

  const createAlreadyViewdFlash = async ({flashId}: {flashId: number}) => {
    await dispatch(createAlreadyViewdFlashThunk({flashId}));
  };

  const flashStackNavigation = useNavigation<FlashStackNavigationProp>();

  const pushProfile = () => {
    flashStackNavigation.push('AnotherUserProfile', {
      ...flashData.user,
      flashes: flashData.flashes,
    });
  };

  return (
    <ShowFlash
      flashData={
        flashData.flashes
          ? flashData
          : {
              flashes: {entities: flashes, alreadyViewed: []},
              user: flashData.user,
            }
      }
      referenceId={referenceId}
      isDisplayed={isDisplayed}
      deleteFlash={deleteFlash}
      createAlreadyViewdFlash={createAlreadyViewdFlash}
      creatingFlash={creatingFlash}
      scrollToNextOrBackScreen={scrollToNextOrBackScreen}
      firstRender={firstRender}
      modalizeRef={modalizeRef}
      goBackScreen={goBackScreen}
      navigateToProfile={pushProfile}
    />
  );
};

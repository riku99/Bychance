import React, {useRef, useEffect} from 'react';
import {Alert} from 'react-native';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Modalize} from 'react-native-modalize';

import {ShowFlash, FlashData} from '../../components/flashes/ShowFlash';
import {RootState, AppDispatch} from '../../redux/index';
import {deleteFlashThunk} from '../../actions/flashes';
import {flashMessage} from '../../helpers/flashMessage';
import {alertSomeError} from '../../helpers/error';

type Props = {
  flashData: FlashData;
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

  return (
    <ShowFlash
      flashData={flashData}
      referenceId={referenceId}
      isDisplayed={isDisplayed}
      deleteFlash={deleteFlash}
      creatingFlash={creatingFlash}
      scrollToNextOrBackScreen={scrollToNextOrBackScreen}
      firstRender={firstRender}
      modalizeRef={modalizeRef}
      goBackScreen={goBackScreen}
    />
  );
};

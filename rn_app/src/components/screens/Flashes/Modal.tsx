import React, {useMemo} from 'react';
import {Alert} from 'react-native';

import {useDeleteFlash} from '~/hooks/flashes';
import {InstaLikeModal} from '~/components/utils/InstaLikeModal';

type Props = {
  isVisible: boolean;
  closeModal: () => void;
  flashId: number;
  setIsVisible: (v: boolean) => void;
};

export const Modal = React.memo(
  ({isVisible, closeModal, flashId, setIsVisible}: Props) => {
    const {deleteFlash} = useDeleteFlash();

    const list = useMemo(
      () => [
        {
          title: '削除',
          color: 'red',
          onPress: () => {
            Alert.alert('本当に削除してもよろしいですか?', '', [
              {
                text: 'キャンセル',
                style: 'cancel',
              },
              {
                text: '削除',
                style: 'destructive',
                onPress: () => {
                  setIsVisible(false);
                  deleteFlash({flashId});
                },
              },
            ]);
          },
        },
      ],
      [deleteFlash, flashId, setIsVisible],
    );

    return (
      <InstaLikeModal
        isVisible={isVisible}
        list={list}
        onCancel={closeModal}
        onBackdropPress={closeModal}
      />
    );
  },
);

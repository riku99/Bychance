import React from 'react';
import {StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {onChange} from 'react-native-reanimated';

import {InstaLikeModal} from '~/components/utils/InstaLikeModal';
import {useUserPageModalList} from '~/hooks/modal';

type Props = {
  userId: string;
  isVisble: boolean;
  closeModal: () => void;
};

export const MoreHorizModal = React.memo(
  ({userId, isVisble, closeModal}: Props) => {
    const {list, blockLoading, deleteLoading} = useUserPageModalList({
      userId,
    });

    return (
      <InstaLikeModal
        list={list}
        onCancel={closeModal}
        isVisible={isVisble}
        onBackdropPress={closeModal}
      />
    );
  },
);

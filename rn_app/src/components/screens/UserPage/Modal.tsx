import React from 'react';

import {InstaLikeModal} from '~/components/utils/InstaLikeModal';
import {useUserPageModalList} from '~/hooks/modal';

type Props = {
  userId: string;
  isVisble: boolean;
  closeModal: () => void;
};

export const MoreHorizModal = React.memo(
  ({userId, isVisble, closeModal}: Props) => {
    const {list} = useUserPageModalList({
      userId,
      closeModal,
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

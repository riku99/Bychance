import {shallowEqual, useSelector} from 'react-redux';

import {selectChatPartnerEntities} from '~/stores/chatPartners';
import {RootState} from '~/stores';

export const useSelectChatPartnerEntities = () => {
  const entities = useSelector(
    (state: RootState) => selectChatPartnerEntities(state),
    shallowEqual,
  );
  return entities;
};

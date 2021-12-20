import {useEffect} from 'react';
import {AppStateStatus, AppState} from 'react-native';
import {getRequestToActiveData} from '~/apis/active';
import {useApikit} from '~/hooks/apikit';
import {setTalkRooms} from '~/stores/_talkRooms';
import {upsertUsers} from '~/stores/_users';
import {useMyId} from '~/hooks/users';
import {updateUser} from '~/stores/user';
import {useGroupBadge} from '~/hooks/appState';

export const useActiveData = () => {
  const id = useMyId();
  const {handleApiError, dispatch} = useApikit();
  const {setGroupBadge} = useGroupBadge();
  useEffect(() => {
    const onActive = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        try {
          const response = await getRequestToActiveData();
          const storedData = response.data.talkRooms.map((d) => {
            const partner = d.sender.id === id ? d.recipient : d.sender;
            const timestamp = d.updatedAt;
            const lastMessage = d.lastMessage.length ? d.lastMessage[0] : null;
            const {updatedAt, sender, recipient, ...restData} = d; //eslint-disable-line
            return {
              ...restData,
              partner,
              timestamp,
              lastMessage,
            };
          });

          const _userData = response.data.talkRooms.map((d) => {
            const partner = d.sender.id === id ? d.recipient : d.sender;
            const block = partner.blocked.some((b) => b.blockBy === id);
            const {blocked, ...data} = partner; // eslint-disable-line
            return {
              ...data,
              block,
            };
          });

          if (response.data.appliedGroups.length) {
            setGroupBadge(true);
          } else {
            setGroupBadge(false);
          }
          dispatch(setTalkRooms(storedData));
          dispatch(upsertUsers(_userData));
          dispatch(
            updateUser({isDisplayedToOtherUsers: response.data.isDisplayed}),
          );
        } catch (e) {
          handleApiError(e);
        }
      }
    };

    AppState.addEventListener('change', onActive);

    return () => {
      AppState.removeEventListener('change', onActive);
    };
  }, [handleApiError, dispatch, id, setGroupBadge]);
};

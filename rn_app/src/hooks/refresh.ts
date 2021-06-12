import {useEffect} from 'react';
import {AppState, AppStateStatus} from 'react-native';

import {useCustomDispatch} from './stores';
import {refreshUserThunk} from '~/apis/users/refreshUser';

export const useActiveRefresh = ({
  login,
  id,
}: {
  login: boolean;
  id?: string;
}) => {
  const dispatch = useCustomDispatch();

  useEffect(() => {
    if (login && id) {
      const _refresh = (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active') {
          dispatch(refreshUserThunk({userId: id}));
        }
      };
      AppState.addEventListener('change', _refresh); // background -> activeになったら更新処理。backgroundの場合位置情報はサーバに保存されるだけでクライアント側の状態は変化させないのでこれにより更新する

      return () => {
        AppState.removeEventListener('change', _refresh);
      };
    }
  }, [login, id, dispatch]);
};

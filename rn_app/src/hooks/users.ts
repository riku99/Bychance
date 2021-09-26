import {useCallback, useEffect, useState} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';
import useSWR from 'swr';

import {RootState} from '~/stores/index';
import {useApikit} from './apikit';
import {setLocation, updateUser} from '~/stores/user';
import {upsertPosts} from '~/stores/posts';
import {upsertFlashes, selectFlashesByUserId} from '~/stores/flashes';
import {
  upsertUsers,
  selectUserAvatar,
  selectUserName,
  selectUserBlock,
} from '~/stores/_users';
import {useRefreshUserPosts} from './posts';
import {useRefreshUserFlashes} from './flashes';
import {
  patchRequestToUsers,
  patchRequestToUsersLocaiton,
  deleteRequestToUsersLocation,
  getRequestToMyRefreshData,
  getRequestToUsersInfo,
  getRequestToUsersIsDisplayedToOtherUsers,
  deleteRequestToUsersGroupId,
} from '~/apis/users';

export const useUser = () =>
  useSelector((state: RootState) => state.userReducer, shallowEqual);

export const useMyId = () =>
  useSelector((state: RootState) => state.userReducer.id);

export const useMyName = () =>
  useSelector((state: RootState) => state.userReducer.name);

export const useMyAvatar = () =>
  useSelector((state: RootState) => state.userReducer.avatar);

export const useMyIntroduce = () =>
  useSelector((state: RootState) => state.userReducer.introduce);

export const useMyBackGroundItem = () =>
  useSelector((state: RootState) => state.userReducer.backGroundItem);

export const useMyBackGroundItemType = () =>
  useSelector((state: RootState) => state.userReducer.backGroundItemType);

export const useMySNSData = () =>
  useSelector((state: RootState) => {
    const {instagram, twitter, youtube, tiktok} = state.userReducer;
    return {
      instagram,
      twitter,
      youtube,
      tiktok,
    };
  }, shallowEqual);

export const useMyStatusMessage = () =>
  useSelector((state: RootState) => state.userReducer.statusMessage);

export const useMyLat = () =>
  useSelector((state: RootState) => state.userReducer.lat);

export const useMyLng = () =>
  useSelector((state: RootState) => state.userReducer.lng);

type EditArg = {
  name: string;
  introduce: string;
  avatar?: string;
  avatarExt?: string | null;
  deleteAvatar: boolean;
  message: string;
  backGroundItem?: string;
  backGroundItemType?: 'image' | 'video';
  deleteBackGroundItem: boolean;
  backGroundItemExt?: string | null;
  instagram: string | null;
  twitter: string | null;
  youtube: string | null;
  tiktok: string | null;
};

export const useEditProfile = () => {
  const {dispatch, handleApiError, toast} = useApikit();

  const [isLoading, setIsLoaidng] = useState(false);

  const editUser = useCallback(
    async ({
      name,
      introduce,
      avatar,
      avatarExt,
      deleteAvatar,
      message,
      backGroundItem,
      backGroundItemType,
      deleteBackGroundItem,
      backGroundItemExt,
      instagram,
      twitter,
      youtube,
      tiktok,
    }: EditArg) => {
      setIsLoaidng(true);

      try {
        const response = await patchRequestToUsers({
          name,
          introduce,
          avatar,
          avatarExt,
          deleteAvatar,
          message,
          backGroundItem,
          backGroundItemType,
          deleteBackGroundItem,
          backGroundItemExt,
          instagram,
          twitter,
          youtube,
          tiktok,
        });

        dispatch(updateUser(response.data));
        toast?.show('更新しました', {type: 'success'});
      } catch (e) {
        setIsLoaidng(false);
        handleApiError(e);
      } finally {
        setIsLoaidng(false);
      }
    },
    [handleApiError, dispatch, toast],
  );

  return {
    editUser,
    isLoading,
  };
};

export const useDeleteLocation = () => {
  const {dispatch, toast, handleApiError} = useApikit();

  const deleteLocaiton = useCallback(async () => {
    try {
      await deleteRequestToUsersLocation();

      toast?.show('削除しました', {type: 'success'});
      dispatch(setLocation({lat: null, lng: null}));
    } catch (e) {
      handleApiError(e);
    }
  }, [toast, dispatch, handleApiError]);

  return {
    deleteLocaiton,
  };
};

export const useRefreshMyData = () => {
  const {dispatch, handleApiError} = useApikit();

  const refreshData = useCallback(async () => {
    try {
      const response = await getRequestToMyRefreshData();

      const {posts, flashes, ...userData} = response.data;
      const storedFlashesData = flashes.map((f) => ({
        ...f,
        viewerViewed: false,
      }));
      dispatch(updateUser(userData));
      dispatch(upsertPosts(posts));
      dispatch(upsertFlashes(storedFlashesData));
    } catch (e) {
      handleApiError(e);
    }
  }, [handleApiError, dispatch]);

  return {
    refreshData,
  };
};

export const useUpdateLocation = () => {
  const {dispatch, handleApiError} = useApikit();

  const updateLocation = useCallback(
    async ({lat, lng}: {lat: number; lng: number}) => {
      try {
        await patchRequestToUsersLocaiton({
          lat,
          lng,
        });

        // バックグラウンド、キル状態の時はdispatchする必要ない(activeになった時に更新するから)のでアクティブの時のみdispatchしている。(あとアクティブじゃない時にJSのコードちゃんと動くのか微妙だった気がする。)
        if (AppState.currentState === 'active') {
          dispatch(setLocation({lat, lng}));
        }
      } catch (e) {
        handleApiError(e);
      }
    },
    [handleApiError, dispatch],
  );

  return {
    updateLocation,
  };
};

export const userPageUrlKey = (id: string) => `users/${id}/page_info`;
export const useUserPageInfo = (userId: string) => {
  const myId = useMyId();
  const {handleApiError, dispatch} = useApikit();
  const {refreshPosts} = useRefreshUserPosts(userId);
  const {refreshFlashes} = useRefreshUserFlashes(userId);
  const fetcher = useCallback(async () => {
    try {
      const response = await getRequestToUsersInfo(userId);

      const data = response.data;
      dispatch(
        upsertUsers([
          {
            id: data.id,
            name: data.name,
            avatar: data.avatar,
            block: data.blockTo,
          },
        ]),
      );

      const storedFlashesData = data.flashes.map((f) => {
        const viewerViewed = f.viewed.some((v) => v.userId === myId);
        return {
          ...f,
          viewerViewed,
        };
      });

      refreshPosts({posts: response.data.posts});
      refreshFlashes({flashes: storedFlashesData});
      dispatch(upsertFlashes(storedFlashesData));

      return response.data;
    } catch (e) {
      handleApiError(e);
    }
  }, [userId, handleApiError, myId, dispatch, refreshPosts, refreshFlashes]);

  const {data, mutate, error} = useSWR(userPageUrlKey(userId), fetcher);

  return {
    data,
    mutate,
    isLoading: !data && !error,
  };
};

export const useIsDisplayedToOtherUsers = () => {
  const {dispatch} = useApikit();
  const isDisplayedToOtherUsers = useSelector(
    (state: RootState) => state.userReducer.isDisplayedToOtherUsers,
  );
  const getIsDisplayedToOtherUsers = useCallback(async () => {
    try {
      const response = await getRequestToUsersIsDisplayedToOtherUsers();

      dispatch(updateUser({isDisplayedToOtherUsers: response.data}));
    } catch (e) {}
  }, [dispatch]);

  return {
    isDisplayedToOtherUsers,
    getIsDisplayedToOtherUsers,
  };
};

export const useGetIsDisplayedToOtherUsersOnActive = () => {
  const {getIsDisplayedToOtherUsers} = useIsDisplayedToOtherUsers();

  // 初回ロード時はActiveの処理は実行されないのでここで別に実行
  useEffect(() => {
    getIsDisplayedToOtherUsers();
  }, [getIsDisplayedToOtherUsers]);

  useEffect(() => {
    const onActive = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        getIsDisplayedToOtherUsers();
      }
    };

    AppState.addEventListener('change', onActive);

    return () => {
      AppState.removeEventListener('change', onActive);
    };
  }, [getIsDisplayedToOtherUsers]);
};

export const useDeleteUsersGroupId = () => {
  const {handleApiError, toast, setToastLoading} = useApikit();

  const deleteGroupId = useCallback(async () => {
    setToastLoading(true);
    try {
      await deleteRequestToUsersGroupId();
      toast?.show('グループから抜けました', {type: 'success'});
    } catch (e) {
      handleApiError(e);
    } finally {
      setToastLoading(false);
    }
  }, [handleApiError, toast, setToastLoading]);

  return {
    deleteGroupId,
  };
};

// こっから下ファイル分けたほうがいい
export const useUserAvatar = ({userId}: {userId: string}) =>
  useSelector((state: RootState) => selectUserAvatar(state, userId));

export const useAvatarOuterType = ({userId}: {userId: string}) => {
  const flashes = useSelector(
    (state: RootState) => selectFlashesByUserId(state, userId),
    shallowEqual,
  );

  return !flashes.length
    ? 'none'
    : flashes.every((f) => f.viewerViewed)
    ? 'silver'
    : 'gradation';
};

export const useUserName = (id: string) =>
  useSelector((state: RootState) => selectUserName(state, id));

export const useUserBlock = (id?: string) =>
  useSelector((state: RootState) => {
    if (!id) {
      return;
    }

    return selectUserBlock(state, id);
  });

import {useCallback, useState} from 'react';
import {AppState} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';
import {default as axios} from 'axios';
import useSWR from 'swr';

import {RootState} from '~/stores/index';
import {useApikit} from './apikit';
import {User} from '~/types/users';
import {baseUrl} from '~/constants/url';
import {
  updateProfile,
  setShowReceiveMessage,
  setTalkRoomMessageReceipt,
  setDisplay,
  setVideoDescription,
  setLocation,
  updateUser,
} from '~/stores/user';
import {UserPageInfo, RefreshMyDataResponse} from '~/types/response/users';
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

export const useSelectTamporarilySavedUserEditData = () => {
  const savedEditData = useSelector((state: RootState) => {
    return state.userReducer.temporarilySavedData;
  }, shallowEqual);
  return savedEditData;
};

export const useMyId = () =>
  useSelector((state: RootState) => state.userReducer.user!.id);

export const useMyName = () =>
  useSelector((state: RootState) => state.userReducer.user!.name);

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

export type EditProfilePayload = Pick<
  User,
  | 'id'
  | 'name'
  | 'introduce'
  | 'avatar'
  | 'statusMessage'
  | 'backGroundItem'
  | 'backGroundItemType'
  | 'instagram'
  | 'twitter'
  | 'youtube'
  | 'tiktok'
>;

export const useEditProfile = () => {
  const {
    dispatch,
    checkKeychain,
    addBearer,
    handleApiError,
    toast,
  } = useApikit();

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

      const credentials = await checkKeychain();

      try {
        const response = await axios.patch<EditProfilePayload>(
          `${baseUrl}/users?id=${credentials?.id}`,
          {
            name,
            introduce,
            avatar,
            avatarExt,
            deleteAvatar,
            statusMessage: message,
            backGroundItem,
            backGroundItemType,
            deleteBackGroundItem,
            backGroundItemExt,
            instagram,
            twitter,
            youtube,
            tiktok,
          },
          addBearer(credentials?.token),
        );
        dispatch(updateProfile(response.data));
        toast?.show('更新しました', {type: 'success'});
      } catch (e) {
        setIsLoaidng(false);
        handleApiError(e);
      } finally {
        setIsLoaidng(false);
      }
    },
    [checkKeychain, addBearer, handleApiError, dispatch, toast],
  );

  return {
    editUser,
    isLoading,
  };
};

export type ChangeShowReceiveMessagePayload = boolean;

export const useChangeShowReceiveMessage = () => {
  const {checkKeychain, handleApiError, addBearer, dispatch} = useApikit();

  const changeShowReceiveMessage = useCallback(
    async ({showReceiveMessage}: {showReceiveMessage: boolean}) => {
      const credentials = await checkKeychain();

      try {
        await axios.patch(
          `${baseUrl}/users/showReceiveMessage?id=${credentials?.id}`,
          {showReceiveMessage},
          addBearer(credentials?.token),
        );

        dispatch(setShowReceiveMessage(showReceiveMessage));
        return true;
      } catch (e) {
        handleApiError(e);
      }
    },
    [checkKeychain, handleApiError, addBearer, dispatch],
  );

  return {
    changeShowReceiveMessage,
  };
};

export type ChangeTalkRoomMessageReceiptPayload = boolean;

export const useChangeTalkRoomMessageReceipt = () => {
  const {addBearer, checkKeychain, dispatch, handleApiError} = useApikit();

  const changeTalkRoomMessageReceipt = useCallback(
    async ({receipt}: {receipt: boolean}) => {
      const credentials = await checkKeychain();

      try {
        await axios.patch(
          `${baseUrl}/users/talkRoomMessageReceipt?id=${credentials?.id}`,
          {receipt},
          addBearer(credentials?.token),
        );

        dispatch(setTalkRoomMessageReceipt(receipt));
        return true;
      } catch (e) {
        handleApiError(e);
      }
    },
    [checkKeychain, addBearer, handleApiError, dispatch],
  );

  return {
    changeTalkRoomMessageReceipt,
  };
};

export type ChangeUserDisplayPayload = boolean;

export const useChangeUserDisplay = () => {
  const {handleApiError, addBearer, dispatch, checkKeychain} = useApikit();

  const changeUserDisplay = useCallback(
    async (display: boolean) => {
      const credentials = await checkKeychain();
      try {
        await axios.patch(
          `${baseUrl}/users/display?id=${credentials?.id}`,
          {
            display,
          },
          addBearer(credentials?.token),
        );

        dispatch(setDisplay(display));
        return true;
      } catch (e) {
        handleApiError(e);
      }
    },
    [checkKeychain, addBearer, handleApiError, dispatch],
  );

  return {
    changeUserDisplay,
  };
};

export type ChangeVideoEditDescriptionPayload = boolean;

export const useChangeVideoEditDescription = () => {
  const {addBearer, dispatch, checkKeychain, handleApiError} = useApikit();

  const changeVideoEditDescription = useCallback(
    async (bool: boolean) => {
      const credentials = await checkKeychain();

      try {
        await axios.patch(
          `${baseUrl}/users/videoEditDescription?id=${credentials?.id}`,
          {videoEditDescription: bool},
          addBearer(credentials?.token),
        );

        dispatch(setVideoDescription(bool));
      } catch (e) {
        handleApiError(e);
      }
    },
    [checkKeychain, addBearer, handleApiError, dispatch],
  );

  return {
    changeVideoEditDescription,
  };
};

export const useDeleteLocation = () => {
  const {
    checkKeychain,
    addBearer,
    dispatch,
    toast,
    handleApiError,
  } = useApikit();

  const deleteLocaiton = useCallback(async () => {
    const credentials = await checkKeychain();

    try {
      await axios.delete(
        `${baseUrl}/users/location?id=${credentials?.id}`,
        addBearer(credentials?.token),
      );

      toast?.show('削除しました', {type: 'success'});
      dispatch(setLocation({lat: null, lng: null}));
    } catch (e) {
      handleApiError(e);
    }
  }, [checkKeychain, addBearer, toast, dispatch, handleApiError]);

  return {
    deleteLocaiton,
  };
};

export const useRefreshMyData = () => {
  const {dispatch, addBearer, handleApiError, checkKeychain} = useApikit();

  const refreshData = useCallback(async () => {
    try {
      const credentials = await checkKeychain();
      const response = await axios.get<RefreshMyDataResponse>(
        `${baseUrl}/my_refresh_data?id=${credentials?.id}`,
        addBearer(credentials?.token),
      );

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
  }, [addBearer, handleApiError, checkKeychain, dispatch]);

  return {
    refreshData,
  };
};

export const useUpdateLocation = () => {
  const {dispatch, checkKeychain, addBearer, handleApiError} = useApikit();

  const updateLocation = useCallback(
    async ({lat, lng}: {lat: number; lng: number}) => {
      const credentials = await checkKeychain();

      try {
        await axios.patch(
          `${baseUrl}/users/location?id=${credentials?.id}`,
          {
            lat,
            lng,
          },
          addBearer(credentials?.token),
        );

        // バックグラウンド、キル状態の時はdispatchする必要ない(activeになった時に更新するから)のでアクティブの時のみdispatchしている。(あとアクティブじゃない時にJSのコードちゃんと動くのか微妙だった気がする。)
        if (AppState.currentState === 'active') {
          dispatch(setLocation({lat, lng}));
        }
      } catch (e) {
        handleApiError(e);
      }
    },
    [checkKeychain, addBearer, handleApiError, dispatch],
  );

  return {
    updateLocation,
  };
};

export const userPageUrlKey = (id: string) => `users/${id}/page_info`;
export const useUserPageInfo = (userId: string) => {
  const myId = useMyId();
  const {checkKeychain, addBearer, handleApiError, dispatch} = useApikit();
  const {refreshPosts} = useRefreshUserPosts(userId);
  const {refreshFlashes} = useRefreshUserFlashes(userId);
  const fetcher = useCallback(async () => {
    try {
      const credentials = await checkKeychain();
      const response = await axios.get<UserPageInfo>(
        `${baseUrl}/users/${userId}/page_info?id=${credentials?.id}`,
        addBearer(credentials?.token),
      );

      const data = response.data;
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
      return response.data;
    } catch (e) {
      handleApiError(e);
    }
  }, [
    checkKeychain,
    addBearer,
    userId,
    handleApiError,
    myId,
    dispatch,
    refreshPosts,
    refreshFlashes,
  ]);

  const {data, mutate} = useSWR(userPageUrlKey(userId), fetcher);

  return {
    data,
    mutate,
  };
};

export const useUserAvatar = ({
  userId,
  avatarUrl,
}: {
  userId: string;
  avatarUrl?: string | null;
}) => {
  const storedUrl = useSelector((state: RootState) =>
    selectUserAvatar(state, userId),
  );
  return storedUrl ? storedUrl : storedUrl === null ? null : avatarUrl;
};

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

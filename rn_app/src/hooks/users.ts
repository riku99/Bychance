import {useCallback, useState} from 'react';
import {AppState} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';
import {default as axios} from 'axios';

import {RootState} from '~/stores/index';
import {UserPageFrom} from '~/navigations/UserPage';
import {selectChatPartner} from '~/stores/chatPartners';
import {selectNearbyUser} from '~/stores/nearbyUsers';
import {useApikit} from './apikit';
import {User, AnotherUser} from '~/types/users';
import {baseUrl} from '~/constants/url';
import {
  updateProfile,
  setShowReceiveMessage,
  setTalkRoomMessageReceipt,
  setDisplay,
  setVideoDescription,
  setLocation,
  setUser,
} from '~/stores/user';
import {Post} from '~/types/posts';
import {Flash} from '~/types/flashes';
import {FlashStamp} from '~/types/flashStamps';
import {setPosts} from '~/stores/posts';
import {setFlashes} from '~/stores/flashes';
import {setFlashStamps} from '~/stores/flashStamps';
import {setChatPartner} from '~/stores/chatPartners';

export const useSelectTamporarilySavedUserEditData = () => {
  const savedEditData = useSelector((state: RootState) => {
    return state.userReducer.temporarilySavedData;
  }, shallowEqual);
  return savedEditData;
};

export const useMyId = () =>
  useSelector((state: RootState) => state.userReducer.user!.id);

export const useAnotherUser = ({
  from,
  userId,
}: {
  from?: UserPageFrom;
  userId?: string;
}) =>
  useSelector((state: RootState) => {
    if (from && userId) {
      switch (from) {
        case 'nearbyUsers':
          return selectNearbyUser(state, userId);
        case 'chatRoom':
          return selectChatPartner(state, userId);
      }
    }
  }, shallowEqual);

// ユーザーページのように自分のデータか他のユーザーのデータが必要となる時に使う
export const useUser = ({
  from,
  userId,
}: {
  from?: UserPageFrom;
  userId?: string;
}) => {
  const myId = useMyId();
  // userIdが存在しない(Tabから呼び出された)またはuserIdがmyIdと同じ(stackから自分のデータを渡して呼び出した)場合はtrue
  const isMe = !userId || myId === userId;

  const me = useSelector((state: RootState) => {
    if (isMe) {
      return state.userReducer.user!;
    }
  }, shallowEqual);

  const anotherUser = useAnotherUser({from, userId});

  // meとanotherUserで共通して使えるものについてはわざわざmeであるかanotherUserであるか検証したくないのでuserとしてまとめる
  // 別々のものとして使いたい時はme, anotherUserのどちらかを使う
  if (isMe) {
    return {
      user: me,
      me,
      isMe,
    };
  } else {
    return {
      user: anotherUser,
      anotherUser,
      isMe,
    };
  }
};

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

export type RefreshUserResponse =
  | {
      isMyData: true;
      user: User;
      posts: Post[];
      flashes: Flash[];
      flashStamps: FlashStamp[];
    }
  | {isMyData: false; data: {user: AnotherUser; flashStamps: FlashStamp[]}};

export const useRefreshUser = () => {
  const {dispatch, addBearer, handleApiError, checkKeychain} = useApikit();

  const refreshUser = useCallback(
    async ({userId}: {userId: string}) => {
      const credentials = await checkKeychain();

      try {
        const response = await axios.get<RefreshUserResponse>(
          `${baseUrl}/users/refresh/${userId}?id=${credentials?.id}`,
          addBearer(credentials?.token),
        );

        if (response.data.isMyData) {
          const {user, posts, flashes, flashStamps} = response.data;

          console.log(user);
          dispatch(setUser(user));
          dispatch(setPosts(posts));
          dispatch(setFlashes(flashes));
          dispatch(setFlashStamps(flashStamps));
        } else {
          const {data} = response.data;
          dispatch(setFlashStamps(data.flashStamps));
          dispatch(setChatPartner(data.user));
        }
      } catch (e) {
        handleApiError(e);
      }
    },
    [addBearer, handleApiError, checkKeychain, dispatch],
  );

  return {
    refreshUser,
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

import axios from 'axios';
import {createAsyncThunk} from '@reduxjs/toolkit';

import {User} from '../../../redux/user';
import {AnotherUser} from '../../../redux/types';
import {rejectPayload} from '../../types';
import {logoutAction} from '../../sessions';
import {checkKeychain} from '../../../helpers/keychain';
import {headers} from '../../../helpers/headers';
import {origin} from '../../../constants/origin';
import {handleBasicError} from '../../../helpers/error';
import {requestLogin} from '../../../helpers/login';

export type RefreshUserThunkPaylaod =
  | {isMyData: true; data: User}
  | {isMyData: false; data: AnotherUser};

export const refreshUserThunk = createAsyncThunk<
  RefreshUserThunkPaylaod,
  {userId: number},
  {rejectValue: rejectPayload}
>('users/refreshUser', async ({userId}, {dispatch, rejectWithValue}) => {
  const credentials = await checkKeychain();

  if (credentials) {
    try {
      const response = await axios.patch<
        {isMyData: true; data: User} | {isMyData: false; data: AnotherUser}
      >(
        `${origin}/user/refresh`,
        {userId, id: credentials.id},
        headers(credentials.token),
      );
      return response.data;
    } catch (e) {
      // axiosエラー
      const result = handleBasicError({e, dispatch});
      return rejectWithValue(result);
    }
  } else {
    // credentialsなしのログインエラー
    requestLogin(() => dispatch(logoutAction));
    return rejectWithValue({errorType: 'loginError'});
  }
});

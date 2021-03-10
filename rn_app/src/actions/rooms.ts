import axios from 'axios';
import {createAsyncThunk} from '@reduxjs/toolkit';

import {logoutAction} from './session/logout';
import {AnotherUser} from '../redux/types';
import {checkKeychain} from '../helpers/keychain';
import {requestLogin} from '../helpers/login';
import {handleBasicError} from '../helpers/error';
import {headers} from '../helpers/headers';
import {origin} from '../constants/origin';
import {rejectPayload} from './types';

export const createRoomThunk = createAsyncThunk<
  {
    presence: boolean;
    roomId: number;
    partner: AnotherUser;
    timestamp: string;
  },
  {partner: AnotherUser},
  {rejectValue: rejectPayload}
>('chats/createRoom', async ({partner}, {dispatch, rejectWithValue}) => {
  const credentials = await checkKeychain();

  if (credentials) {
    try {
      const response = await axios.post<{
        presence: boolean;
        roomId: number;
        timestamp: string;
      }>(
        `${origin}/rooms`,
        {accessId: credentials.id, partnerId: partner.id},
        headers(credentials.token),
      );

      return {...response.data, partner};
    } catch (e) {
      const result = handleBasicError({e, dispatch});
      return rejectWithValue(result);
    }
  } else {
    // loginerror
    requestLogin(() => dispatch(logoutAction));
    return rejectWithValue({errorType: 'loginError'});
  }
});

import axios from 'axios';
import {createAsyncThunk} from '@reduxjs/toolkit';

import {logoutAction} from '../../sessions';
import {origin} from '../../../constants/origin';
import {headers} from '../../../helpers/headers';
import {checkKeychain} from '../../../helpers/keychain';
import {requestLogin} from '../../../helpers/login';
import {handleBasicError} from '../../../helpers/error';
import {rejectPayload} from '../../types';

export type EidtUserDisplayThunk = boolean;

export const editUserDisplayThunk = createAsyncThunk<
  EidtUserDisplayThunk,
  boolean,
  {rejectValue: rejectPayload}
>('users/editUserDisplay', async (display, {dispatch, rejectWithValue}) => {
  const credentials = await checkKeychain();
  if (credentials) {
    try {
      await axios.patch(
        `${origin}/user/display`,
        {accessId: credentials.id, display},
        headers(credentials.token),
      );
      return display;
    } catch (e) {
      const result = handleBasicError({e, dispatch});
      return rejectWithValue(result);
    }
  } else {
    requestLogin(() => dispatch(logoutAction));
    return rejectWithValue({errorType: 'loginError'});
  }
});

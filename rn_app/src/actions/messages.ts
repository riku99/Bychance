import axios from 'axios';
import {createAsyncThunk} from '@reduxjs/toolkit';

import {logoutAction} from './session/logout';
import {rejectPayload} from './types';
import {checkKeychain} from '../helpers/keychain';
import {requestLogin} from '../helpers/login';
import {headers} from '../helpers/headers';
import {Message} from '../redux/messages';
import {handleBasicError} from '../helpers/error';
import {origin} from '../constants/origin';

export const createReadMessagesThunk = createAsyncThunk<
  undefined,
  {roomId: number; unreadNumber: number},
  {
    rejectValue: rejectPayload;
  }
>(
  'messages/createReadMessages',
  async ({roomId, unreadNumber}, {dispatch, rejectWithValue}) => {
    const keychain = await checkKeychain();

    if (keychain) {
      try {
        axios.post(
          `${origin}/user_room_message_reads`,
          {
            roomId,
            unreadNumber,
            id: keychain.id,
          },
          headers(keychain.token),
        );
      } catch (e) {
        // axioserror
        const result = handleBasicError({e, dispatch});
        return rejectWithValue(result);
      }
    } else {
      // loginerror
      requestLogin(() => dispatch(logoutAction));
      return rejectWithValue({errorType: 'loginError'});
    }
  },
);

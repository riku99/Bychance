import axios from 'axios';
import {createAsyncThunk} from '@reduxjs/toolkit';

import {logoutAction} from './sessions';
import {rejectPayload} from './types';
import {checkKeychain} from '../helpers/keychain';
import {requestLogin} from '../helpers/login';
import {headers} from '../helpers/headers';
import {Message} from '../redux/messages';
import {handleBasicError} from '../helpers/error';
import {origin} from '../constants/origin';

export const createMessageThunk = createAsyncThunk<
  {message: Message; roomId: number},
  {roomId: number; userId: number; text: string},
  {
    rejectValue: rejectPayload;
  }
>(
  'messages/createMessage',
  async ({roomId, userId, text}, {dispatch, rejectWithValue}) => {
    const credentials = await checkKeychain();

    if (credentials) {
      try {
        const response = await axios.post<Message>(
          `${origin}/messages`,
          {
            roomId,
            userId,
            text,
            id: credentials.id,
          },
          headers(credentials.token),
        );

        return {message: response.data, roomId};
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

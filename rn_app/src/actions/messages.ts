import axios from 'axios';
import {createAsyncThunk} from '@reduxjs/toolkit';

import {logoutAction} from './sessions';
import {rejectPayload} from './d';
import {changeMessagesRead} from '../apis/messagesApi';
import {checkKeychain} from '../helpers/keychain';
import {requestLogin} from '../helpers/login';
import {headers} from '../helpers/headers';
import {MessageType} from '../redux/messages';
import {alertSomeError, handleBasicError} from '../helpers/error';
import {origin} from '../constants/origin';

export const createMessageThunk = createAsyncThunk<
  {message: MessageType; roomId: number},
  {roomId: number; userId: number; text: string},
  {
    rejectValue: rejectPayload;
  }
>(
  'messages/createMessage',
  async ({roomId, userId, text}, {dispatch, rejectWithValue}) => {
    const keychain = await checkKeychain();

    if (keychain) {
      try {
        const response = await axios.post<MessageType>(
          `${origin}/messages`,
          {
            roomId,
            userId,
            text,
            id: keychain.id,
          },
          headers(keychain.token),
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

export const changeMessagesReadThunk = createAsyncThunk(
  'messages/changeRead',
  async (messageIds: number[], thunkAPI) => {
    const keychain = await checkKeychain();
    if (keychain) {
      const response = await changeMessagesRead({
        id: keychain.id,
        token: keychain.token,
        messageIds,
      });

      if (response.type === 'success') {
        return response.data;
      }

      if (response.type === 'loginError') {
        console.log('ログインエラー');
        thunkAPI.rejectWithValue({errorType: response.type});
      }

      if (response.type === 'someError') {
        alertSomeError();
        thunkAPI.rejectWithValue({errorType: response.type});
      }
    }
  },
);

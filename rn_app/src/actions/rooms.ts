import {createAsyncThunk} from '@reduxjs/toolkit';

import {logoutAction} from './sessions';
import {createRoom} from '../apis/roomsApi';
import {AnotherUser} from '../components/users/SearchUsers';
import {checkKeychain} from '../helpers/keychain';
import {requestLogin} from '../helpers/login';
import {alertSomeError} from '../helpers/error';

export const createRoomThunk = createAsyncThunk(
  'chats/createRoom',
  async (recipient: AnotherUser, thunkAPI) => {
    const keychain = await checkKeychain();

    if (keychain) {
      const response = await createRoom({
        id: keychain.id,
        token: keychain.token,
        recipientId: recipient.id,
      });

      if (response.type === 'success') {
        return {
          id: response.data.id,
          recipient: recipient,
          timestamp: response.data.timestamp,
        };
      }

      if (response.type === 'loginError') {
        requestLogin(() => {
          thunkAPI.dispatch(logoutAction);
        });
        return thunkAPI.rejectWithValue({loginError: true});
      }

      if (response.type === 'someError') {
        console.log(response.message);
        alertSomeError();
        return thunkAPI.rejectWithValue({someError: true});
      }

      throw new Error();
    } else {
      requestLogin(() => {
        thunkAPI.dispatch(logoutAction);
      });
      return thunkAPI.rejectWithValue({loginError: true});
    }
  },
);

import {createAsyncThunk} from '@reduxjs/toolkit';

import {createRoom} from '../apis/roomsApi';
import {anotherUser} from '../redux/others';
import {checkKeychain} from '../helpers/keychain';
import {requestLogin} from '../helpers/login';
import {loginErrorThunk} from '.';
import {alertSomeError} from '../helpers/error';

export const createRoomThunk = createAsyncThunk(
  'chats/createRoom',
  async (recipient: anotherUser, thunkAPI) => {
    const keychain = await checkKeychain();

    if (keychain) {
      const response = await createRoom({
        id: keychain.id,
        token: keychain.token,
        recipientId: recipient.id,
      });

      if (response.type === 'success') {
        if (response.data.presence) {
          return {
            id: response.data.id,
            presence: true,
            timestamp: response.data.timestamp,
          };
        } else {
          return {
            id: response.data.id,
            recipient: recipient,
            presence: false,
            timestamp: response.data.timestamp,
          };
        }
      }

      if (response.type === 'loginError') {
        requestLogin(() => {
          thunkAPI.dispatch(loginErrorThunk());
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
        thunkAPI.dispatch(loginErrorThunk());
      });
      return thunkAPI.rejectWithValue({loginError: true});
    }
  },
);

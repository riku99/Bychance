import {createAsyncThunk} from '@reduxjs/toolkit';

import {createRoom} from '../apis/chatApi';
import {OtherUserType} from '../redux/others';
import {checkKeychain} from '../helpers/keychain';
import {requestLogin} from '../helpers/login';
import {loginErrorThunk} from '.';
import {alertSomeError} from '../helpers/error';

export const createRoomThunk = createAsyncThunk(
  'chats/createRoom',
  async (recipient: OtherUserType, thunkAPI) => {
    const keychain = await checkKeychain();

    if (keychain) {
      const response = await createRoom({
        id: keychain.id,
        token: keychain.token,
        recipientId: recipient.id,
      });

      if (response.type === 'success') {
        if (response.data.presence) {
          return {id: response.data.id, presence: true};
        } else {
          return {id: response.data.id, recipient: recipient, presence: false};
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
    } else {
      requestLogin(() => {
        thunkAPI.dispatch(loginErrorThunk());
      });
    }
  },
);

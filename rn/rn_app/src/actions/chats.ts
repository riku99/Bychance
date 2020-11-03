import {createAsyncThunk} from '@reduxjs/toolkit';

import {createRoom} from '../apis/chatApi';
import {OtherUserType} from '../redux/others';
import {checkKeychain} from '../helpers/keychain';
import {requestLogin} from '../helpers/login';
import {loginErrorThunk} from '.';

export const createRoomThunk = createAsyncThunk(
  'chats/createRoom',
  async (recipient: Omit<OtherUserType, 'message'>, thunkAPI) => {
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
    } else {
      requestLogin(() => {
        thunkAPI.dispatch(loginErrorThunk());
      });
    }
  },
);

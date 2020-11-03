import {compose, createAsyncThunk} from '@reduxjs/toolkit';

import {createRoom} from '../apis/chatApi';
import {OtherUserType} from '../redux/others';
import {checkKeychain} from '../helpers/keychain';
import {requestLogin} from '../helpers/login';
import {loginErrorThunk} from '.';

export const createRoomThunk = createAsyncThunk(
  'chats/createRoom',
  async (partner: Omit<OtherUserType, 'message'>, thunkAPI) => {
    const keychain = await checkKeychain();

    if (keychain) {
      const response = await createRoom({
        id: keychain.id,
        token: keychain.token,
        partnerId: partner.id,
      });

      if (response.type === 'success') {
        console.log(response.data.presence);
        if (response.data.presence) {
          return {id: response.data.id, presence: true};
        } else {
          return {id: response.data.id, patner: partner, presence: false};
        }
      }
    } else {
      requestLogin(() => {
        thunkAPI.dispatch(loginErrorThunk());
      });
    }
  },
);

import {createAsyncThunk} from '@reduxjs/toolkit';
import {showMessage} from 'react-native-flash-message';

import {createRoom, createMessage} from '../apis/chatApi';
import {OtherUserType} from '../redux/others';
import {checkKeychain} from '../helpers/keychain';
import {requestLogin} from '../helpers/login';
import {loginErrorThunk} from '.';
import {alertSomeError} from '../helpers/error';
import {MessageType} from '../redux/chat';

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
      return thunkAPI.rejectWithValue({loginError: true});
    }
  },
);

export const createMessageThunk = createAsyncThunk(
  'chats/createMessage',
  async (
    {roomId, userId, text}: Pick<MessageType, 'roomId' | 'userId' | 'text'>,
    thunkAPI,
  ) => {
    const keychain = await checkKeychain();

    if (keychain) {
      const response = await createMessage({
        id: keychain.id,
        token: keychain.token,
        roomId,
        userId,
        text,
      });

      if (response.type === 'success') {
        return response.data;
      }

      if (response.type === 'loginError') {
        requestLogin(() => {
          thunkAPI.dispatch(loginErrorThunk());
        });
        return thunkAPI.rejectWithValue(response);
      }

      if (response.type === 'invalidError') {
        showMessage({
          message: '無効なメッセージです',
          type: 'danger',
          style: {opacity: 0.9},
          titleStyle: {fontWeight: 'bold'},
        });
        return thunkAPI.rejectWithValue(response);
      }
    } else {
      requestLogin(() => {
        thunkAPI.dispatch(loginErrorThunk());
      });
      return thunkAPI.rejectWithValue({type: 'loginError'});
    }
  },
);

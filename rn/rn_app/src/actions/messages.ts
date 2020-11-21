import {createAsyncThunk} from '@reduxjs/toolkit';
import {showMessage} from 'react-native-flash-message';

import {createMessage, changeMessagesRead} from '../apis/messagesApi';
import {checkKeychain} from '../helpers/keychain';
import {requestLogin} from '../helpers/login';
import {logout} from '../redux/index';

import {MessageType} from '../redux/messages';
import {alertSomeError} from '../helpers/error';

export const createMessageThunk = createAsyncThunk(
  'messages/createMessage',
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
        return {message: response.data, room: roomId};
      }

      if (response.type === 'loginError') {
        requestLogin(() => {
          thunkAPI.dispatch(logout());
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
        thunkAPI.dispatch(logout());
      });
      return thunkAPI.rejectWithValue({type: 'loginError'});
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

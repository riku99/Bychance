import axios from 'axios';
import {createAsyncThunk} from '@reduxjs/toolkit';

import {rejectPayload} from '../../types';
import {logoutAction} from '../../session/logout';
import {checkKeychain} from '../../../helpers/keychain';
import {requestLogin} from '../../../helpers/login';
import {handleBasicError} from '../../../helpers/error';
import {headers} from '../../../helpers/headers';
import {origin} from '../../../constants/origin';
import {NearbyUsers} from '../../../redux/nearbyUsers';

export type GetNearbyUsersPayload = NearbyUsers;

export const getNearbyUsersThunk = createAsyncThunk<
  GetNearbyUsersPayload,
  {lat: number | null; lng: number | null; range: number},
  {
    rejectValue: rejectPayload;
  }
>(
  'others/getNearbyUsersThunk',
  async ({lat, lng, range}, {dispatch, rejectWithValue}) => {
    const keychain = await checkKeychain();
    if (keychain) {
      try {
        const response = await axios.get<GetNearbyUsersPayload>(
          `${origin}/users`,
          {
            params: {id: keychain.id, lat, lng, range},
            ...headers(keychain.token),
          },
        );

        return response.data;
      } catch (e) {
        const result = handleBasicError({dispatch, e});
        return rejectWithValue(result);
      }
    } else {
      requestLogin(() => dispatch(logoutAction));
      return rejectWithValue({errorType: 'loginError'});
    }
  },
);

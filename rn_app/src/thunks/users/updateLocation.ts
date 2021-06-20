import {
  axios,
  createAsyncThunk,
  origin,
  headers,
  checkKeychain,
  handleCredentialsError,
  handleBasicApiErrorWithDispatch,
  RejectPayload,
} from '../re-modules';

export type UpdateLocationThunkPaylaod = {
  lat: number | null;
  lng: number | null;
};

export type UpdateLocationThunkArg = {
  lat: number | null;
  lng: number | null;
};

export const patchLocation = async ({
  lat,
  lng,
  credentials,
}: {
  lat: number;
  lng: number;
  credentials: {
    id: string;
    token: string;
  };
}) => {
  try {
    await axios.patch<{succless: boolean}>(
      `${origin}/users/location?id=${credentials.id}`,
      {lat, lng},
      headers(credentials.token),
    );
  } catch {}
};

export const updateLocationThunk = createAsyncThunk<
  UpdateLocationThunkPaylaod,
  UpdateLocationThunkArg,
  {rejectValue: RejectPayload}
>('users/location', async ({lat, lng}, {dispatch, rejectWithValue}) => {
  const credentials = await checkKeychain();

  if (credentials) {
    try {
      await axios.patch<{succless: boolean}>(
        `${origin}/users/location?id=${credentials.id}`,
        {lat, lng},
        headers(credentials.token),
      );
      return {lat, lng};
    } catch (e) {
      const result = handleBasicApiErrorWithDispatch({e, dispatch});
      return rejectWithValue(result);
    }
  } else {
    handleCredentialsError(dispatch);
    return rejectWithValue({errorType: 'loginError'});
  }
});

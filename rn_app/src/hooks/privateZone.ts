import {useEffect, useState} from 'react';
import axios from 'axios';

import {checkKeychain} from '~/helpers/credentials';
import {origin} from '~/constants/origin';
import {headers} from '~/helpers/requestHeaders';
import {handleBasicApiErrorWithDispatch} from '~/helpers/errors';

export const useFetchPrivateZone = () => {
  const [result, setResult] = useState();

  useEffect(() => {
    const _fetch = async () => {
      const credentials = await checkKeychain();

      if (credentials) {
        try {
          const _result = await axios.get(
            `${origin}/privateZone?id=${credentials.id}`,
            headers(credentials.token),
          );
        } catch (e) {}
      } else {
        // ログインエラーハンドリング
      }
    };
  }, []);
};

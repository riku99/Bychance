import * as Keychain from 'react-native-keychain';

export type Credentials = {id: string; token: string};

export const checkKeychain = async () => {
  const credentials = await Keychain.getGenericPassword();
  const id = credentials && credentials.username;
  const token = credentials && credentials.password;
  if (id && token) {
    return {id, token};
  } else {
    return;
  }
};

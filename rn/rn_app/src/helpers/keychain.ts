import * as Keychain from 'react-native-keychain';

export const checkKeychain = async () => {
  const credentials = await Keychain.getGenericPassword();
  if (!credentials || !credentials.password) {
    throw new Error('ログインできません。ログインしなおしてください');
  }
  const token = credentials.password;
  return token;
};

import * as Keychain from 'react-native-keychain';

export const checkKeychain = async () => {
  const credentials = await Keychain.getGenericPassword();
  if (!credentials || !credentials.password) {
    return;
  }
  const token = credentials.password;
  return token;
};

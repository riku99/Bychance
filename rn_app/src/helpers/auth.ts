import auth from '@react-native-firebase/auth';

export const getIdToken = async () => {
  const user = auth().currentUser;
  if (!user) {
    return;
  }
  return await user.getIdToken();
};

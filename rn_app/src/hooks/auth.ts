import {useCallback} from 'react';
import auth from '@react-native-firebase/auth';
import {useToast} from 'react-native-fast-toast';

export const useSignUp = () => {
  const toast = useToast();

  const createUser = useCallback(
    async ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) => {
      try {
        const {
          user: firebaseUser,
        } = await auth().createUserWithEmailAndPassword(email, password);
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          toast.show('メールアドレスは既に使用されています', {
            type: 'danger',
          });
          return;
        }

        if (error.code === 'auth/invalid-email') {
          toast.show('無効なアドレスです', {type: 'danger'});
          return;
        }

        if (error.code === 'auth/weak-password') {
          toast.show('パスワードは8文字以上にしてください');
          return;
        }

        toast.show('何らかのエラーが発生しました', {type: 'danger'});
      }
    },
    [toast],
  );

  return {
    createUser,
  };
};

export const useConfirmationOfImail = () => {
  const toast = useToast();

  const confirmEmail = useCallback(
    async (email: string) => {
      try {
        const providers = await auth().fetchSignInMethodsForEmail(email);
        return !providers.length;
      } catch (e) {
        if (e.code === 'auth/invalid-email') {
          toast.show('無効なアドレスです', {type: 'danger'});
        }

        return false;
      } finally {
      }
    },
    [toast],
  );

  return {
    confirmEmail,
  };
};

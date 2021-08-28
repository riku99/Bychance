import {useMemo} from 'react';
import {Alert} from 'react-native';

import {useCreateBlcok} from './block';

export const useUserPageModalList = ({userId}: {userId?: string}) => {
  const {block} = useCreateBlcok();

  const list = useMemo(
    () => [
      {
        title: 'ブロックする',
        color: 'red',
        onPress: () => {
          if (userId) {
            Alert.alert(
              'ブロックしますか?',
              'ブロックされた人はあなたの投稿、フラッシュを見られなくなりあなたにメッセージを送っても届かなくなります。ブロックしたことは相手に通知されません。',
              [
                {
                  text: 'ブロックする',
                  style: 'destructive',
                  onPress: () => {
                    block({blockTo: userId});
                  },
                },
                {
                  text: 'キャンセル',
                },
              ],
            );
            // block({blockTo: userId});
          }
        },
      },
      {
        title: 'このアカウントについて',
        onPress: () => {},
      },
      {
        title: 'プロフィールURLをコピー',
        onPress: () => {},
      },
    ],
    [block, userId],
  );

  return {
    list,
  };
};

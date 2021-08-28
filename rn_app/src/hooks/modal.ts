import {useMemo} from 'react';
import {Alert} from 'react-native';

import {useCreateBlcok} from './block';
import {useUserBlock} from './users';

export const useUserPageModalList = ({userId}: {userId?: string}) => {
  const {block, isLoading: blockLoading} = useCreateBlcok();
  const _block = useUserBlock(userId);

  const list = useMemo(() => {
    const modalText = {
      title: !_block ? 'ブロックする' : 'ブロック解除',
      alertTitle: !_block ? 'ブロックしますか?' : '解除しますか?',
      alertSubTitle: !_block
        ? 'ブロックされた人はあなたの投稿、フラッシュを見られなくなりあなたにメッセージを送っても届かなくなります。ブロックしたことは相手に通知されません。'
        : '',
      alertButtonText: !_block ? 'ブロックする' : '解除する',
    };

    return [
      {
        title: modalText.title,
        color: 'red',
        onPress: () => {
          if (userId) {
            Alert.alert(modalText.alertTitle, modalText.alertSubTitle, [
              {
                text: modalText.alertButtonText,
                style: 'destructive',
                onPress: () => {
                  block({blockTo: userId});
                },
              },
              {
                text: 'キャンセル',
              },
            ]);
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
    ];
  }, [block, userId, _block]);

  return {
    list,
    blockLoading,
  };
};

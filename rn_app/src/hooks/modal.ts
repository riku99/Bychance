import {useMemo} from 'react';
import {Alert} from 'react-native';

import {useCreateBlcok, useDeleteBlock} from './block';
import {useUserBlock} from './users';

export const useUserPageModalList = ({userId}: {userId: string}) => {
  const {block, isLoading: blockLoading} = useCreateBlcok({blockTo: userId});
  const {deleteBlock, isLoading: deleteLoading} = useDeleteBlock();
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

    const onBlockPress = () => {
      if (!userId) {
        return;
      }
      if (!_block) {
        block();
      } else {
        deleteBlock({userId});
      }
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
                onPress: onBlockPress,
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
  }, [block, userId, _block, deleteBlock]);

  return {
    list,
    blockLoading,
    deleteLoading,
  };
};

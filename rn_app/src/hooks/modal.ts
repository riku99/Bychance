import {useMemo} from 'react';
import {Alert} from 'react-native';

import {useCreateBlock, useDeleteBlock} from './block';
import {useUserBlock} from './users';
import {useRemovePostsAndFlashesDispatch} from './stores';

export const useUserPageModalList = ({userId}: {userId: string}) => {
  const {block} = useCreateBlock();
  const {deleteBlock} = useDeleteBlock();
  const _block = useUserBlock(userId);
  const {removeDispatch} = useRemovePostsAndFlashesDispatch({userId});

  const list = useMemo(() => {
    const blockText = {
      title: !_block ? 'ブロックする' : 'ブロック解除',
      alertTitle: !_block ? 'ブロックしますか?' : '解除しますか?',
      alertSubTitle: !_block
        ? 'ブロックされた人はあなたの投稿、フラッシュを見られなくなりあなたにメッセージを送っても届かなくなります。ブロックしたことは相手に通知されません。'
        : '',
      alertButtonText: !_block ? 'ブロックする' : '解除する',
    };

    const groupText = {
      title: 'グループになることを申請する',
      alertTitle: 'グループ申請しますか?',
      alertSubTitle: 'マイページにこのユーザーのアイコンが表示されます',
      alertButtonText: '申請する',
    };

    const onBlockPress = async () => {
      if (!userId) {
        return;
      }
      if (!_block) {
        const result = await block({blockTo: userId});
        if (result) {
          removeDispatch();
        }
      } else {
        deleteBlock({userId});
      }
    };

    return [
      {
        title: 'グループ申請',
        onPress: () => {
          Alert.alert(groupText.title, groupText.alertSubTitle, [
            {
              text: groupText.alertButtonText,
            },
            {
              text: 'キャンセル',
            },
          ]);
        },
      },
      {
        title: blockText.title,
        color: 'red',
        onPress: () => {
          if (userId) {
            Alert.alert(blockText.alertTitle, blockText.alertSubTitle, [
              {
                text: blockText.alertButtonText,
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
    ];
  }, [block, userId, _block, deleteBlock, removeDispatch]);

  return {
    list,
  };
};

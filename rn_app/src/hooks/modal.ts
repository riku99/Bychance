import {useMemo} from 'react';
import {Alert} from 'react-native';
import {useToast} from 'react-native-fast-toast';

import {useCreateBlock, useDeleteBlock} from './block';
import {useUserBlock} from './users';
import {useRemovePostsAndFlashesDispatch} from './stores';
import {useCreateApplyingGroup} from './applyingGroups';
import {useVideoCallingToken} from './videoCalling';

export const useUserPageModalList = ({
  userId,
  closeModal,
}: {
  userId: string;
  closeModal?: () => void;
}) => {
  const {block} = useCreateBlock();
  const {deleteBlock} = useDeleteBlock();
  const _block = useUserBlock(userId);
  const {removeDispatch} = useRemovePostsAndFlashesDispatch({userId});
  const toast = useToast();
  const {applyGroup} = useCreateApplyingGroup();
  const {createToken} = useVideoCallingToken();

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
      title: 'グループ申請してよろしいですか?',
      alertTitle: 'グループ申請しますか?',
      alertSubTitle: '',
      alertButtonText: '申請する',
    };

    const videoCallingText = {
      title: 'ビデオ通話をかけてよろしいですか?',
      alertTitle: 'ビデオ通話をかけてよろしいですか?',
      alertSubTitle: '',
      alertButtonText: 'かける',
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
              text: 'キャンセル',
            },
            {
              text: groupText.alertButtonText,
              style: 'destructive',
              onPress: async () => {
                const result = await applyGroup({userId});
                if (result) {
                  if (closeModal) {
                    closeModal();
                  }
                  toast?.show('申請しました', {type: 'success'});
                }
              },
            },
          ]);
        },
      },
      {
        title: 'ビデオ通話',
        onPress: async () => {
          Alert.alert(
            videoCallingText.alertTitle,
            videoCallingText.alertSubTitle,
            [
              {
                text: 'キャンセル',
              },
              {
                text: videoCallingText.alertButtonText,
                style: 'destructive',
                onPress: async () => {
                  await createToken({
                    channelName: 'sample',
                    otherUserId: userId,
                  });
                },
              },
            ],
          );
        },
      },
      {
        title: blockText.title,
        color: 'red',
        onPress: () => {
          if (userId) {
            Alert.alert(blockText.alertTitle, blockText.alertSubTitle, [
              {
                text: 'キャンセル',
              },
              {
                text: blockText.alertButtonText,
                style: 'destructive',
                onPress: onBlockPress,
              },
            ]);
          }
        },
      },
    ];
  }, [
    block,
    userId,
    _block,
    deleteBlock,
    removeDispatch,
    applyGroup,
    toast,
    closeModal,
    createToken,
  ]);

  return {
    list,
  };
};

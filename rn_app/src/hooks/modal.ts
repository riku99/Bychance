import {useMemo} from 'react';
import {Alert} from 'react-native';
import {useToast} from 'react-native-fast-toast';

import {useCreateBlock, useDeleteBlock} from './block';
import {useUserBlock} from './users';
import {useRemovePostsAndFlashesDispatch} from './stores';
import {useCreateApplyingGroup} from './applyingGroups';
import {useVideoCalling} from './videoCalling';

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
  const {makeCall} = useVideoCalling();

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
          if (_block) {
            Alert.alert(
              'ユーザーをブロックしています',
              'ブロックしているユーザーにビデオ通話をかけることはできません',
            );
          }
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
                  if (closeModal) {
                    closeModal();
                  }
                  // makeCallでエラー起きた場合Alertを出すことがあるが、Alertが出た後にcloseModalが実行されるとレンダリングの関係(?)でAlertがすぐ消えてしまうので若干遅く呼び出している。(よくないが)
                  setTimeout(async () => {
                    await makeCall({
                      otherUserId: userId,
                    });
                  }, 350);
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
    makeCall,
  ]);

  return {
    list,
  };
};

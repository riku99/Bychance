import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {IMessage} from 'react-native-gifted-chat';
import {RouteProp} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {useToast} from 'react-native-toast-notifications';
import {Chat} from './Chat';
import {TalkRoomStackNavigationProp} from '../../../navigations/types';
import {TalkRoomStackParamList} from '../../../navigations/TalkRoom';
import {
  useCreateReadTalkRoomMessages,
  useCreateTalkRoomMessage,
} from '~/hooks/talkRoomMessages';
import {useGetMessages} from '~/hooks/talkRoomMessages';
import {useMyId, useUserAvatar, useUserName} from '~/hooks/users';
import {selectRoom} from '~/stores/_talkRooms';
import {RootState} from '~/stores';
import {UserAvatar} from '~/components/utils/Avatar';
import {Dimensions} from 'react-native';
import {useGroupMemberWhoBlcokTargetUserExists} from '~/hooks/groups';
import {DescriptionModal} from './DescriptionModal';

type RootRouteProp = RouteProp<TalkRoomStackParamList, 'TalkRoom'>;

type Props = {
  route: RootRouteProp;
  navigation: TalkRoomStackNavigationProp<'TalkRoom'>;
};

export const TalkRoom = ({route, navigation}: Props) => {
  const {talkRoomId, partner} = route.params;
  const avatar = useUserAvatar({userId: partner.id});
  const name = useUserName(partner.id);
  const {result} = useGetMessages({talkRoomId});
  const [messages, setMessages] = useState<IMessage[]>([]);
  const myId = useMyId();
  const {createMessage} = useCreateTalkRoomMessage();
  const lastMessage = useSelector((state: RootState) => {
    const room = selectRoom(state, talkRoomId);
    if (room) {
      return room.lastMessage;
    }
  });
  useCreateReadTalkRoomMessages({
    talkRoomId,
  });
  const [sendMessage, setSendMessage] = useState(false);

  useEffect(() => {
    if (result?.length) {
      const iData = result.map((d) => ({
        _id: d.id,
        text: d.text,
        createdAt: new Date(d.createdAt),
        user: {
          _id: d.userId,
          avatar:
            d.userId !== myId && avatar
              ? avatar
              : () => <UserAvatar image={null} size="small" />,
        },
      }));
      setMessages(iData);
    }
  }, [result, avatar, myId]);

  useEffect(() => {
    if (lastMessage && myId !== lastMessage.userId) {
      setMessages((current) => {
        const filtered = current.filter((d) => d._id !== lastMessage.id);
        return [
          {
            _id: lastMessage.id,
            text: lastMessage.text,
            createdAt: new Date(lastMessage.createdAt),
            user: {
              _id: lastMessage.userId,
              avatar:
                lastMessage.userId !== myId && avatar
                  ? avatar
                  : () => <UserAvatar image={null} size="small" />,
            },
          },
          ...filtered,
        ];
      });
    }
  }, [lastMessage, myId, avatar]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: name ? name : 'ユーザーが存在しません',
    });
  });

  const onSend = async (text: string) => {
    setSendMessage(true);
    const temporaryId = Math.random().toString(32).substring(2); //一時的なIDのためのランダムな文字列
    const newMessage = {
      _id: temporaryId,
      text,
      createdAt: new Date(),
      user: {
        _id: myId,
      },
    };

    // レスポンス待ってセットすると若干のタイムラグがあるので先に仮のデータをセット
    setMessages((current) => [newMessage, ...current]);

    const _result = await createMessage({
      roomId: talkRoomId,
      partnerId: partner.id,
      text,
    });

    if (_result) {
      const {message} = _result;
      // レスポンス取得した仮のデータを変更する
      setMessages((current) => {
        const filtered = current.filter((m) => m._id !== temporaryId);
        return [
          {
            _id: message.id,
            text: message.text,
            createdAt: new Date(message.createdAt),
            user: {
              _id: message.userId,
              avatar:
                message.userId !== myId && avatar
                  ? avatar
                  : () => <UserAvatar image={null} size="small" />,
            },
          },
          ...filtered,
        ];
      });
    } else {
      setMessages((current) => current.filter((m) => m._id !== temporaryId)); // レスポンス取得できなかったら仮データも削除
    }
  };

  const onAvatarPress = useCallback(() => {
    navigation.navigate('UserPage', {userId: partner.id});
  }, [partner.id, navigation]);

  const {
    result: groupMemberWhoBlockThisUserExists,
  } = useGroupMemberWhoBlcokTargetUserExists({targetUserId: partner.id});
  const toast = useToast();
  useEffect(() => {
    if (groupMemberWhoBlockThisUserExists) {
      toast?.show(
        'あなたのグループのメンバーがこのユーザーをブロックしています。やりとりには注意してください',
        {
          type: 'normal',
          duration: 8000,
          style: {
            marginTop: height * 0.1,
          },
        },
      );
    }
    return () => {
      toast.hideAll();
    };
  }, [toast, groupMemberWhoBlockThisUserExists]);

  return (
    <>
      <Chat
        messages={messages}
        userId={myId}
        onSend={onSend}
        onAvatarPress={onAvatarPress}
      />
      {sendMessage && <DescriptionModal />}
    </>
  );
};

const {height} = Dimensions.get('screen');

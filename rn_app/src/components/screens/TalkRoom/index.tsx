import React, {useEffect, useLayoutEffect, useState} from 'react';
import {IMessage} from 'react-native-gifted-chat';
import {RouteProp} from '@react-navigation/native';
import {useSelector} from 'react-redux';

import {Chat} from './Chat';
import {TalkRoomStackNavigationProp} from '../../../navigations/types';
import {TalkRoomStackParamList} from '../../../navigations/TalkRoom';
import {
  useCreateReadTalkRoomMessages,
  useCreateTalkRoomMessage,
} from '~/hooks/talkRoomMessages';
import {useGetMessages} from '~/hooks/talkRoomMessages';
import {useMyId} from '~/hooks/users';
import {selectRoom} from '~/stores/_talkRooms';
import {RootState} from '~/stores';

type RootRouteProp = RouteProp<TalkRoomStackParamList, 'TalkRoom'>;

type Props = {
  route: RootRouteProp;
  navigation: TalkRoomStackNavigationProp<'TalkRoom'>;
};

export const TalkRoom = ({route, navigation}: Props) => {
  const {talkRoomId, partner} = route.params;
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

  useEffect(() => {
    if (result?.length) {
      const iData = result.map((d) => ({
        _id: d.id,
        text: d.text,
        createdAt: new Date(d.createdAt),
        user: {
          _id: d.userId,
          avatar:
            d.userId !== myId && partner.avatar ? partner.avatar : undefined,
        },
      }));
      setMessages(iData);
    }
  }, [result, partner.avatar, myId]);

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
                lastMessage.userId !== myId && partner.avatar
                  ? partner.avatar
                  : undefined,
            },
          },
          ...filtered,
        ];
      });
    }
  }, [lastMessage, myId, partner.avatar]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: partner.name,
    });
  });

  const onSend = async (text: string) => {
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
                message.userId !== myId && partner.avatar
                  ? partner.avatar
                  : undefined,
            },
          },
          ...filtered,
        ];
      });
    } else {
      setMessages((current) => current.filter((m) => m._id !== temporaryId)); // レスポンス取得できなかったら仮データも削除
    }
  };

  return <Chat messages={messages} userId={myId} onSend={onSend} />;

  // const myId = useSelector((state: RootState) => state.userReducer.user!.id);
  // const room = useSelector((state: RootState) => {
  //   const _room = selectRoom(state, route.params.roomId);
  //   if (_room) {
  //     return _room;
  //   } else {
  //     throw new Error('not found room');
  //   }
  // }, shallowEqual);
  // const selectedMessages = useSelector((state: RootState) => {
  //   if (room) {
  //     return selectMessages(state, room.messages);
  //   } else {
  //     return [];
  //   }
  // }, shallowEqual);
  // const partner = useSelector(
  //   (state: RootState) => selectChatPartner(state, route.params.partnerId),
  //   shallowEqual,
  // );
  // const onAvatarPress = useCallback(() => {
  //   if (partner) {
  //     navigation.navigate('UserPage', {
  //       userId: partner.id,
  //       from: 'chatRoom',
  //     });
  //   }
  // }, [navigation, partner]);
  // const [messages, setMessages] = useState<IMessage[]>(() => {
  //   if (selectedMessages && selectedMessages.length) {
  //     const _messages = selectedMessages.map((m) => {
  //       return {
  //         _id: m.id,
  //         text: m.text,
  //         createdAt: new Date(m.timestamp),
  //         user: {
  //           _id: m.userId,
  //           avatar: () => (
  // <UserAvatar
  //   image={partner?.avatar}
  //   size={'small'}
  //   opacity={1}
  //   onPress={onAvatarPress}
  // />;
  //           ),
  //         },
  //       };
  //     });
  //     return _messages;
  //   } else {
  //     return [];
  //   }
  // });
  // const messageIds = useMemo(() => messages.map((m) => m._id), [messages]);
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerTitle: partner?.name ? partner.name : 'メンバーが存在しません',
  //   });
  // });
  // const dispatch = useCustomDispatch();
  // const {createReadTalkRoomMessages} = useCreateReadTalkRoomMessages();
  // const {createMessage} = useCreateTalkRoomMessage();
  // // チャットルームを開いている時にメッセージを受け取った時のためのセレクタ
  // const receivedMessage = useSelector((state: RootState) => {
  //   return state.otherSettingsReducer.receivedMessage;
  // }, shallowEqual);
  // // チャットルームを開いている時にでメッセージを受け取った場合のためのeffect。メッセージを受け取り、そのメッセージがこのルーム宛のものであれば表示
  // useEffect(() => {
  //   if (
  //     receivedMessage &&
  //     receivedMessage.roomId === room.id &&
  //     !messageIds.includes(receivedMessage.id)
  //   ) {
  //     setMessages((m) => {
  //       return [
  //         {
  //           _id: receivedMessage.id,
  //           text: receivedMessage.text,
  //           createdAt: new Date(receivedMessage.timestamp),
  //           user: {
  //             _id: receivedMessage.userId,
  //             avatar: () => (
  //               <UserAvatar
  //                 image={partner?.avatar}
  //                 size={'small'}
  //                 opacity={0}
  //                 onPress={onAvatarPress}
  //               />
  //             ),
  //           },
  //         },
  //         ...m,
  //       ];
  //     });
  //     dispatch(resetRecievedMessage());
  //     // ルームを開いている状態で取得したメッセージなので未読数を0にする
  //     dispatch(resetUnreadNumber({roomId: room.id}));
  //     // 既読データをサーバの方で作成
  //     createReadTalkRoomMessages({
  //       roomId: room.id,
  //       unreadNumber: 1,
  //       partnerId: route.params.partnerId,
  //     });
  //   }
  // }, [
  //   receivedMessage,
  //   room.id,
  //   partner?.avatar,
  //   route.params.partnerId,
  //   onAvatarPress,
  //   messageIds,
  //   createReadTalkRoomMessages,
  //   dispatch,
  // ]);
  // useEffect(() => {
  //   if (room) {
  //     dispatch(resetRecievedMessage());
  //     // ルームが開かれたら未読を0にする
  //     const unsubscribe = navigation.addListener('focus', () => {
  //       if (room.unreadNumber !== 0) {
  //         dispatch(resetUnreadNumber({roomId: room.id}));
  //         createReadTalkRoomMessages({
  //           roomId: room.id,
  //           unreadNumber: room.unreadNumber,
  //           partnerId: route.params.partnerId,
  //         });
  //       }
  //     });
  //     return unsubscribe;
  //   }
  // }, [
  //   navigation,
  //   room,
  //   dispatch,
  //   route.params.partnerId,
  //   createReadTalkRoomMessages,
  // ]);
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('blur', () => {
  //     dispatch(resetRecievedMessage());
  //   });
  //   return unsubscribe;
  // }, [navigation, dispatch]);
  // // メッセージの送信
  // const onSend = useCallback(
  //   async (text: string) => {
  //     if (room) {
  //       const temporaryId = Math.random().toString(32).substring(2); //一時的なIDのためのランダムな文字列
  //       setMessages([
  //         {
  //           _id: temporaryId,
  //           text,
  //           createdAt: new Date(),
  //           user: {
  //             _id: myId,
  //           },
  //         },
  //         ...messages,
  //       ]);
  //       const result = await createMessage({
  //         roomId: room.id,
  //         partnerId: route.params.partnerId,
  //         text,
  //       });
  // if (result) {
  //   setMessages((current) => {
  //     const filtered = current.filter(
  //       (message) => message._id !== temporaryId,
  //     );
  //     return [
  //       {
  //         _id: result.id,
  //         text: result.text,
  //         createdAt: new Date(result.timestamp),
  //         user: {
  //           _id: result.userId,
  //         },
  //       },
  //       ...filtered,
  //     ];
  //   });
  //       } else {
  //         setMessages((current) =>
  //           current.filter((message) => message._id !== temporaryId),
  //         );
  //       }
  //     }
  //   },
  //   [room, route.params.partnerId, messages, createMessage, myId],
  // );
  // return <TalkRoom messages={messages} userId={myId} onSend={onSend} />;
};

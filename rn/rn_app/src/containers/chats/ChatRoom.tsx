import React, {useMemo, useCallback} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {IMessage} from 'react-native-gifted-chat';
import {RouteProp} from '@react-navigation/native';

import {ChatRoom} from '../../components/chats/ChatRoom';
import {RootState} from '../../redux/index';
import {createMessageThunk} from '../../actions/messages';
import {RootStackParamList} from '../../screens/Root';
import {selectMessages} from '../../redux/messages';
import {selectMessageIds} from '../../redux/rooms';

const noImage = require('../../assets/no-Image.png');

type RootRouteProp = RouteProp<RootStackParamList, 'ChatRoom'>;

type Props = {route: RootRouteProp};

export const Container = ({route}: Props) => {
  const {id} = useSelector((state: RootState) => {
    return {
      id: state.userReducer.user!.id,
    };
  }, shallowEqual);

  const selectedMessages = useSelector((state: RootState) => {
    const messageIds = selectMessageIds(state, route.params.id);
    return selectMessages(state, messageIds);
  });

  const messages: IMessage[] = useMemo(() => {
    const _messages = selectedMessages.map((m) => {
      return {
        _id: m.id,
        text: m.text,
        createdAt: new Date(m.timestamp),
        user: {
          _id: m.userId,
          avatar: route.params.partner.image
            ? route.params.partner.image
            : noImage,
        },
      };
    });
    return _messages;
  }, [route.params.partner.image, selectedMessages]);

  const dispatch = useDispatch();

  const onSend = useCallback(
    (text: string) => {
      dispatch(
        createMessageThunk({
          roomId: route.params.id,
          userId: id,
          text,
        }),
      );
    },
    [route.params.id, dispatch, id],
  );

  return <ChatRoom messages={messages} userId={id} onSend={onSend} />;
};

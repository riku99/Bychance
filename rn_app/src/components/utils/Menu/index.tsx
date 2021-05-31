import React, {useState, useMemo, useEffect, useRef, useCallback} from 'react';
import {Switch, Alert, View, Dimensions, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as Keychain from 'react-native-keychain';
import {ListItem, Icon} from 'react-native-elements';
import {Modalize} from 'react-native-modalize';

import {RootState} from '../../../stores/index';
import {displayMenu} from '../../../stores/otherSettings';
import {editUserDisplayThunk} from '../../../apis/users/changeUserDisplay';
import {logoutAction} from '~/apis/session/logout';
import {changeTalkRoomMessageReceiptThunk} from '~/apis/users/changeTalkRoomMessageReceipt';

export const Menu = React.memo(() => {
  const isVisible = useSelector((state: RootState) => {
    return state.otherSettingsReducer.displayedMenu!;
  });

  const userDisplay = useSelector((state: RootState) => {
    return state.userReducer.user!.display;
  });

  const talkRoomMessageReceipt = useSelector(
    (state: RootState) => state.userReducer.user!.talkRoomMessageReceipt,
  );

  const dispatch = useDispatch();

  const dispatchDiplayMenu = () => {
    dispatch(displayMenu());
  };

  const changeUserDisplay = useCallback(
    (display: boolean) => {
      dispatch(editUserDisplayThunk(display));
    },
    [dispatch],
  );

  const changeTalkRoomMessageReceipt = useCallback(
    (receipt: boolean) => {
      dispatch(changeTalkRoomMessageReceiptThunk({receipt}));
    },
    [dispatch],
  );

  const [displaySwitch, setDisplaySwitch] = useState(userDisplay);
  const [
    talkRoomMessageReceiptSwitch,
    setTalkRoomMessageReceiptSwitch,
  ] = useState(talkRoomMessageReceipt);

  const list = useMemo(() => {
    return [
      {
        title: '他のユーザーに自分を表示',
        icon: 'emoji-people',
        titleStyle: {fontSize: 15, color: '#575757'},
        onPress: () => {},
        addComponent: (
          <Switch
            value={displaySwitch}
            style={{transform: [{scaleX: 0.8}, {scaleY: 0.8}]}}
            onValueChange={() => {
              if (displaySwitch) {
                setDisplaySwitch(false);
                changeUserDisplay(false);
              } else {
                setDisplaySwitch(true);
                changeUserDisplay(true);
              }
            }}
          />
        ),
      },
      {
        title: '他のユーザーからメッセージを受け取る',
        icon: 'mail-outline',
        titleStyle: {fontSize: 15, color: '#575757'},
        addComponent: (
          <Switch
            value={talkRoomMessageReceiptSwitch}
            style={{transform: [{scaleX: 0.8}, {scaleY: 0.8}]}}
            onValueChange={() => {
              if (talkRoomMessageReceiptSwitch) {
                setTalkRoomMessageReceiptSwitch(false);
                changeTalkRoomMessageReceipt(false);
              } else {
                setTalkRoomMessageReceiptSwitch(true);
                changeTalkRoomMessageReceipt(true);
              }
            }}
          />
        ),
      },
      {
        title: 'ログアウト',
        icon: 'logout',
        titleStyle: {fontSize: 15, color: '#575757'},
        onPress: () => {
          Alert.alert('ログアウトしますか?', '', [
            {
              text: 'はい',
              onPress: async () => {
                await Keychain.resetGenericPassword();
                dispatch(logoutAction);
                return;
              },
            },
            {
              text: 'いいえ',
              onPress: () => {
                return;
              },
            },
          ]);
        },
      },
    ];
  }, [
    changeUserDisplay,
    dispatch,
    displaySwitch,
    talkRoomMessageReceiptSwitch,
    changeTalkRoomMessageReceipt,
  ]);

  const modalizeRef = useRef<Modalize>(null);
  useEffect(() => {
    if (isVisible) {
      modalizeRef.current?.open();
    }
  }, [isVisible]);

  return (
    <Modalize
      ref={modalizeRef}
      modalHeight={height / 2}
      onClose={dispatchDiplayMenu}
      scrollViewProps={{
        scrollEnabled: false,
      }}>
      <View style={styles.inModalContainer}>
        {list.map((l, i) => {
          return (
            <ListItem key={i} onPress={l.onPress}>
              <Icon name={l.icon} color={l.titleStyle.color} />
              <ListItem.Content>
                <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
              </ListItem.Content>
              {l.addComponent}
            </ListItem>
          );
        })}
      </View>
    </Modalize>
  );
});

const {height} = Dimensions.get('window');

const styles = StyleSheet.create({
  inModalContainer: {
    width: '97%',
    alignSelf: 'center',
    marginTop: 10,
  },
});

import React, {useMemo, useEffect, useRef, useCallback} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {ListItem, Icon} from 'react-native-elements';
import {Modalize} from 'react-native-modalize';
import {useNavigation} from '@react-navigation/native';

import {RootState} from '../../../stores/index';
import {displayMenu} from '../../../stores/otherSettings';
import {RootStackParamList} from '~/navigations/Root';

export const Menu = React.memo(() => {
  const isVisible = useSelector((state: RootState) => {
    return state.otherSettingsReducer.displayedMenu!;
  });

  const modalizeRef = useRef<Modalize>(null);
  useEffect(() => {
    if (isVisible) {
      modalizeRef.current?.open();
    }
  }, [isVisible]);

  const dispatch = useDispatch();

  const dispatchDiplayMenu = () => {
    dispatch(displayMenu());
  };

  const navigation = useNavigation();

  const modalClose = useCallback(() => {
    if (modalizeRef.current) {
      modalizeRef.current.close();
    }
  }, []);

  const navigateToConfig = useCallback(
    (goTo: RootStackParamList['UserConfing']['goTo']) => {
      navigation.navigate('UserConfing', {goTo});
    },
    [navigation],
  );

  const list = useMemo(() => {
    return [
      {
        title: '自分の表示',
        icon: 'emoji-people',
        titleStyle: styles.listTitleStyle,
        onPress: () => {
          modalClose();
          navigateToConfig('display');
        },
      },
      {
        title: 'メッセージ',
        icon: 'mail-outline',
        titleStyle: styles.listTitleStyle,
        onPress: () => {
          modalClose();
          navigateToConfig('message');
        },
      },
      {
        title: '位置情報',
        icon: 'location-pin',
        titleStyle: styles.listTitleStyle,
        onPress: () => {
          modalClose();
          navigateToConfig('location');
        },
      },
      {
        title: 'アカウント',
        icon: 'account-circle',
        titleStyle: styles.listTitleStyle,
        onPress: () => {
          modalClose();
          navigateToConfig('account');
        },
      },
      {
        title: 'その他',
        icon: 'subject',
        titleStyle: styles.listTitleStyle,
        onPress: () => {
          modalClose();
          navigateToConfig('others');
        },
      },
    ];
  }, [modalClose, navigateToConfig]);

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
    marginTop: 9,
    backgroundColor: 'gray',
  },
  listTitleStyle: {
    fontSize: 17,
    color: '#575757',
  },
});

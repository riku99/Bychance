import React, {useMemo, useEffect, useRef, useCallback} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import {ListItem, Icon} from 'react-native-elements';
import {Modalize} from 'react-native-modalize';
import {useNavigation} from '@react-navigation/native';

import {RootStackParamList} from '~/navigations/Root';
import {useDisplayedMenu} from '~/hooks/appState';

export const Menu = React.memo(() => {
  const {displayedMenu, setDisplayedMenu} = useDisplayedMenu();

  const modalizeRef = useRef<Modalize>(null);
  useEffect(() => {
    if (displayedMenu) {
      modalizeRef.current?.open();
    }
  }, [displayedMenu]);

  const navigation = useNavigation();

  const closeModal = useCallback(() => {
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
          closeModal();
          navigateToConfig('display');
        },
      },
      {
        title: 'グループ',
        icon: 'people',
        titleStyle: styles.listTitleStyle,
        onPress: () => {
          closeModal();
          navigation.navigate('applyingGroup');
        },
      },
      {
        title: 'メッセージ',
        icon: 'mail-outline',
        titleStyle: styles.listTitleStyle,
        onPress: () => {
          closeModal();
          navigateToConfig('message');
        },
      },
      {
        title: '位置情報',
        icon: 'location-pin',
        titleStyle: styles.listTitleStyle,
        onPress: () => {
          closeModal();
          navigateToConfig('location');
        },
      },
      {
        title: 'アカウント',
        icon: 'account-circle',
        titleStyle: styles.listTitleStyle,
        onPress: () => {
          closeModal();
          navigateToConfig('account');
        },
      },
      {
        title: 'その他',
        icon: 'subject',
        titleStyle: styles.listTitleStyle,
        onPress: () => {
          closeModal();
          navigateToConfig('others');
        },
      },
    ];
  }, [closeModal, navigateToConfig, navigation]);

  return (
    <Modalize
      ref={modalizeRef}
      modalHeight={height / 1.8}
      onClose={() => setDisplayedMenu(false)}
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
    fontWeight: '500',
    color: '#575757',
  },
});

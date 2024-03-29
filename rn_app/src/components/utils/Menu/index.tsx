import React, {useMemo, useEffect, useRef, useCallback} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import {ListItem, Icon, Badge} from 'react-native-elements';
import {Modalize} from 'react-native-modalize';
import {useNavigation} from '@react-navigation/native';

import {RootStackParamList} from '~/navigations/Root';
import {useDisplayedMenu, useGroupBadge} from '~/hooks/appState';

export const Menu = React.memo(() => {
  const {displayedMenu, setDisplayedMenu} = useDisplayedMenu();
  const {groupBadge} = useGroupBadge();

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
    (goTo: RootStackParamList['UserConfig']['goTo']) => {
      navigation.navigate('UserConfig', {goTo});
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
        badge: groupBadge,
        titleStyle: styles.listTitleStyle,
        onPress: () => {
          closeModal();
          navigation.navigate('Groups');
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
        title: 'ビデオ通話',
        icon: 'video-call',
        titleStyle: styles.listTitleStyle,
        onPress: () => {
          closeModal();
          navigateToConfig('videoCalling');
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
  }, [closeModal, navigateToConfig, navigation, groupBadge]);

  return (
    <Modalize
      ref={modalizeRef}
      modalHeight={400}
      onClose={() => setDisplayedMenu(false)}
      scrollViewProps={{
        scrollEnabled: false,
      }}>
      <View style={styles.inModalContainer}>
        {list.map((l, i) => {
          return (
            <ListItem key={i} onPress={l.onPress}>
              <View>
                <Icon name={l.icon} color={l.titleStyle.color} />
                {l.badge && <Badge containerStyle={styles.badgeContainer} />}
              </View>
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
  badgeContainer: {
    position: 'absolute',
    right: -4,
  },
});

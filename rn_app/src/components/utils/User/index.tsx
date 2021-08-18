import React, {useMemo, useRef, useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ScrollView,
  Text,
  Dimensions,
  FlatList,
} from 'react-native';
import {useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';
import {UIActivityIndicator} from 'react-native-indicators';
import {useNavigation} from '@react-navigation/native';

import {UserTabView, stickyTabHeight} from './TabView';
import {Avatar} from './Avatar';
import {EditButton} from './EditButton';
import {TakeFlashButton} from './TakeFlashButton';
import {SendMessageButton} from './SendMessageButton';
import {MoreReadBottun} from './MoreReadButton';
import {IntroduceModal} from './IntoduceModal';
import {BackGroundItem} from './BackGroundItem';
import {SnsIcons} from './SnsIcons';
import {RootState} from '../../../stores/index';
import {RootNavigationProp} from '~/navigations/Root';
import {judgeMoreDeviceX} from '~/helpers/device';
import {Menu} from '~/components/utils/Menu';
import {normalStyles} from '~/constants/styles';
import {useMyId} from '~/hooks/users';
import {StampValues} from '~/types/domain/Flashes';
import {UserPageNavigationProp} from '~/navigations/UserPage';

type _Props = {
  data: {
    user: {
      id: string;
      name: string;
      avatar: string | null;
      introduce: string | null;
      backGroundItem: string | null;
      backGroundItemType: 'image' | 'video' | null;
      instagram: string | null;
      twitter: string | null;
      youtube: string | null;
      tiktok: string | null;
    };
    posts: {
      id: number;
      text: string | null;
      url: string;
      createdAt: string;
      userId: string;
      sourceType: 'image' | 'video';
    }[];
    flashesData: {
      entities: {
        id: number;
        source: string;
        createdAt: string;
        sourceType: 'image' | 'video';
        userId: string;
        stamps: {
          id: number;
          createdAt: string;
          value: StampValues;
          userId: string;
          flashId: number;
        }[];
        viewed: {userId: string}[];
      }[];
      viewerViewedFlasheIds: number[];
      viewedAllFlashes: boolean;
    };
  };
};

export const User = ({data}: _Props) => {
  const {user, flashesData, posts} = data;
  const {
    id,
    name,
    avatar,
    introduce,
    backGroundItem,
    backGroundItemType,
    instagram,
    twitter,
    youtube,
    tiktok,
  } = user;
  const snsLinkData = {instagram, twitter, youtube, tiktok};
  const myId = useMyId();
  const isMe = id === myId;
  const navigation = useNavigation<
    RootNavigationProp<'Tab'> & UserPageNavigationProp<'UserPage'>
  >();

  const avatarOuterType: 'gradation' | 'silver' | 'none' = useMemo(() => {
    if (!data) {
      return 'none';
    }

    if (data.flashesData.entities.length) {
      if (data.flashesData.viewedAllFlashes) {
        return 'silver';
      } else {
        return 'gradation';
      }
    } else {
      return 'none';
    }
  }, [data]);

  const [containerHeight, setContainerHeight] = useState(0);

  const scrollY = useRef(new Animated.Value(0)).current;
  const y = scrollY.interpolate({
    inputRange: [0, profileContainerHeight],
    outputRange: [0, -profileContainerHeight],
    extrapolateRight: 'clamp',
  });

  // 2つの子コンポーネントで必要なrefなのでこのコンポーネントから渡す
  const postsTabViewRef = useRef<FlatList>(null);
  const userInformationTabViewRef = useRef<ScrollView>(null);

  const lineNumber = useMemo(
    () =>
      data?.user.introduce?.split(/\n|\r\n|\r/).length
        ? data.user.introduce?.split(/\n|\r\n|\r/).length
        : 0,
    [data?.user.introduce],
  );

  const [introduceHeight, setIntroduceHeight] = useState(0);
  const [introduceModal, setIntroduceModal] = useState(false);
  const [moreReadButton, setMoreReadButton] = useState(false);
  useEffect(() => {
    if (introduceHeight) {
      if (lineNumber * oneIntroduceTextLineHeght > introduceHeight) {
        setMoreReadButton(true);
      } else {
        setMoreReadButton(false);
      }
    }
  }, [introduceHeight, lineNumber]);

  const [videoPaused, setVideoPaused] = useState(false);
  const onBackGroundItemPress = useCallback(() => {
    if (backGroundItem && backGroundItemType) {
      if (backGroundItemType === 'video') {
        setVideoPaused(true);
      }
      navigation.navigate('UserBackGroundView', {
        source: backGroundItem,
        sourceType: backGroundItemType,
      });
    }
  }, [navigation, backGroundItem, backGroundItemType]);

  useEffect(() => {
    // サムネイルのpreload
    if (backGroundItemType === 'video' && backGroundItem) {
      FastImage.preload([
        {
          uri: backGroundItem,
        },
      ]);
    }
  }, [backGroundItem, backGroundItemType]);

  // BackGroundItemViewから戻ってきた時にビデオが停止されていた場合再開させたい
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (videoPaused) {
        setVideoPaused(false);
      }
    });

    return unsubscribe;
  }, [navigation, videoPaused]);

  const flashesNavigationParam = useMemo(() => {
    return {
      isMyData: isMe,
      startingIndex: 0,
      data: [
        {
          flashes: flashesData.entities,
          user: {
            id,
            name,
            avatar,
          },
          viewerViewedFlasheIds: flashesData.viewerViewedFlasheIds,
        },
      ],
    };
  }, [
    id,
    name,
    avatar,
    isMe,
    flashesData.entities,
    flashesData.viewerViewedFlasheIds,
  ]);

  const onAvatarPress = useCallback(() => {
    if (flashesNavigationParam) {
      setVideoPaused(true);
      navigation.navigate('Flashes', {
        screen: 'Flashes',
        params: flashesNavigationParam,
      });
    }
  }, [flashesNavigationParam, navigation]);

  const creatingPost = useSelector(
    (state: RootState) => state.otherSettingsReducer.creatingPost,
  );

  const creatingFlash = useSelector(
    (state: RootState) => state.otherSettingsReducer.creatingFlash,
  );

  const displayedMenu = useSelector((state: RootState) => {
    return state.otherSettingsReducer.displayedMenu;
  });

  if (!data) {
    //スケルトンとか追加するかも
    return null;
  }

  return (
    <View
      style={styles.container}
      onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}>
      <Animated.View
        onLayout={(e) => setIntroduceHeight(e.nativeEvent.layout.height)}
        style={[
          styles.introduceContainer,
          {
            transform: [{translateY: y}],
          },
        ]}>
        <Text style={{lineHeight: oneIntroduceTextLineHeght}}>{introduce}</Text>
      </Animated.View>

      {creatingPost && (
        <Animated.View
          style={[
            styles.creatingPostContaienr,
            {transform: [{translateY: y}]},
          ]}>
          <Text style={styles.creatingPostText}>作成中です</Text>
          <View style={{width: 17}}>
            <UIActivityIndicator size={14} color="gray" />
          </View>
        </Animated.View>
      )}

      {creatingFlash && (
        <Animated.View
          style={[
            styles.creatingFlashContaienr,
            {transform: [{translateY: y}]},
          ]}>
          <Text style={styles.creatingPostText}>作成中です</Text>
          <View style={{width: 17}}>
            <UIActivityIndicator size={14} color="gray" />
          </View>
        </Animated.View>
      )}

      <UserTabView
        userId={id}
        posts={posts}
        containerHeight={containerHeight}
        profileContainerHeight={profileContainerHeight}
        scrollY={scrollY}
        postsTabViewRef={postsTabViewRef}
        userInformationTabViewRef={userInformationTabViewRef}
      />

      <Animated.View
        style={[
          styles.backGroundImageContainer,
          {transform: [{translateY: y}]},
        ]}>
        <BackGroundItem
          source={backGroundItem}
          sourceType={backGroundItemType}
          onPress={onBackGroundItemPress}
          videoPaused={videoPaused}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.animatedElement,
          styles.avatarAndNameContainer,
          {
            transform: [{translateY: y}],
          },
        ]}>
        <View style={{alignItems: 'center'}}>
          <Avatar
            source={avatar}
            outerType={avatarOuterType}
            onPress={onAvatarPress}
          />

          <View style={styles.nameContainer}>
            <Text style={{fontWeight: 'bold', fontSize: 16}}>{name}</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.editProfileOrSendMessageButtonContainer,
          styles.animatedElement,
          {
            transform: [{translateY: y}],
          },
        ]}>
        <View style={{width: '50%'}}>
          {isMe ? (
            <EditButton />
          ) : (
            <SendMessageButton id={id} name={name} avatar={avatar} />
          )}
        </View>
      </Animated.View>

      {moreReadButton && (
        <Animated.View
          style={[
            styles.moreReadButtonContainer,
            {transform: [{translateY: y}]},
          ]}>
          <MoreReadBottun onPress={() => setIntroduceModal(true)} />
        </Animated.View>
      )}

      {introduceModal && (
        <IntroduceModal
          show={introduceModal}
          introduce={introduce ? introduce : ''}
          onClose={() => setIntroduceModal(false)}
        />
      )}

      <Animated.View
        style={[
          styles.animatedElement,
          styles.snsIconsContainer,
          {transform: [{translateY: y}]},
        ]}>
        <SnsIcons snsLinkData={snsLinkData} />
      </Animated.View>

      {isMe && (
        <View style={styles.takeWideRangeSourceContainer}>
          <TakeFlashButton />
        </View>
      )}

      {displayedMenu && isMe && <Menu />}
    </View>
  );
};

const {height} = Dimensions.get('screen');

const moreXHeight = judgeMoreDeviceX();

const profileContainerHeight = moreXHeight ? height / 1.9 : height / 1.75;

export const oneIntroduceTextLineHeght = 19.7;

const nameContainerHeight = 19.5;

const avatarAndNameContainerHeight =
  (moreXHeight ? 119.5 : 113) - nameContainerHeight - 10;

const avatarAndNameContainerTop = moreXHeight ? height * 0.115 : height * 0.1;

const introduceContainerTop = moreXHeight ? height * 0.273 : height * 0.284;
const introduceContainerHeight = height * 0.14;

const snsIconsContainerTop = profileContainerHeight - stickyTabHeight - 12;

const backgroundItemHeight = height * 0.16;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backGroundImageContainer: {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: backgroundItemHeight,
    backgroundColor: normalStyles.imageBackGroundColor,
  },
  introduceContainer: {
    position: 'absolute',
    top: introduceContainerTop,
    paddingHorizontal: 14,
    width: '100%',
    height: introduceContainerHeight,
  },
  avatarAndNameContainer: {
    top: avatarAndNameContainerTop,
    left: 10,
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  nameContainer: {
    marginTop: moreXHeight ? 15 : 13,
  },
  editProfileOrSendMessageButtonContainer: {
    width: '100%',
    top: moreXHeight ? height * 0.1 : height * 0.09,
    left: '45%',
    marginTop: avatarAndNameContainerHeight,
  },
  animatedElement: {
    position: 'absolute',
  },
  takeWideRangeSourceContainer: {
    position: 'absolute',
    bottom: '3%',
    right: '7%',
  },
  moreReadButtonContainer: {
    position: 'absolute',
    top: introduceContainerTop + introduceContainerHeight,
    right: '2%',
  },
  snsIconsContainer: {
    top: snsIconsContainerTop,
    alignItems: 'center',
  },
  creatingPostContaienr: {
    position: 'absolute',
    top: snsIconsContainerTop + 21,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  creatingPostText: {
    fontSize: 14,
    color: 'gray',
  },
  creatingFlashContaienr: {
    position: 'absolute',
    top: '22%',
    left: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurStyle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    opacity: 0.25,
  },
});

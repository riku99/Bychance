import React, {useMemo, useRef, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ScrollView,
  Text,
  Dimensions,
  FlatList,
} from 'react-native';

import {UserTabView, stickyTabHeight} from './TabView';
import {Avatar} from './Avatar';
import {EditButton} from './EditButton';
import {TakeFlashButton} from './TakeFlashButton';
import {SendMessageButton} from './SendMessageButton';
import {MoreReadBottun} from './MoreReadButton';
import {IntroduceModal} from './IntoduceModal';
import {BackGroundItem} from './BackGroundItem';
import {SnsIcons} from './SnsIcons';
import {Menu} from '~/components/utils/Menu';
import {normalStyles} from '~/constants/styles';
import {useMyId} from '~/hooks/users';
import {CreatingPost, CreatingFlash} from './Creating';
import {
  editProfileOrSendMessageButtonContainerTop,
  avatarContainerTop,
  nameContainerTop,
  nameAndAvatarLeft,
  introduceContainerTop,
  creatingFlashContainerTop,
  profileContainerHeight,
  backgroundItemHeight,
} from './styles';

type _Props = {
  id: string;
  name: string;
  avatar: string | null;
  introduce?: string | null;
  backGroundItem?: string | null;
  backGroundItemType?: 'image' | 'video' | null;
  snsData?: {
    instagram: string | null;
    twitter: string | null;
    youtube: string | null;
    tiktok: string | null;
  };
  refresh: () => Promise<void>;
  isLoading?: boolean;
};

export const User = ({
  id,
  name,
  avatar,
  introduce,
  backGroundItem,
  backGroundItemType,
  snsData,
  refresh,
  isLoading,
}: _Props) => {
  const snsLinkData = snsData;
  const myId = useMyId();
  const isMe = id === myId;

  const [containerHeight, setContainerHeight] = useState(0);

  const scrollY = useRef(new Animated.Value(0)).current;
  const y = scrollY.interpolate({
    inputRange: [0, profileContainerHeight],
    outputRange: [0, -profileContainerHeight],
    extrapolateRight: 'clamp',
  });

  const postsTabViewRef = useRef<FlatList>(null);
  const groupsTabViewRef = useRef<ScrollView>(null);

  const lineNumber = useMemo(
    () =>
      introduce?.split(/\n|\r\n|\r/).length
        ? introduce?.split(/\n|\r\n|\r/).length
        : 0,
    [introduce],
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

      {isMe && (
        <Animated.View
          style={[
            styles.creatingPostContaienr,
            {transform: [{translateY: y}]},
          ]}>
          <CreatingPost />
        </Animated.View>
      )}

      {isMe && (
        <Animated.View
          style={[
            styles.creatingFlashContaienr,
            {transform: [{translateY: y}]},
          ]}>
          <CreatingFlash />
        </Animated.View>
      )}

      <UserTabView
        userId={id}
        containerHeight={containerHeight}
        profileContainerHeight={profileContainerHeight}
        scrollY={scrollY}
        postsTabViewRef={postsTabViewRef}
        groupsTabViewRef={groupsTabViewRef}
        refresh={refresh}
        isLoading={isLoading}
      />

      <Animated.View
        style={[
          styles.backGroundImageContainer,
          {transform: [{translateY: y}]},
        ]}>
        <BackGroundItem
          source={backGroundItem}
          sourceType={backGroundItemType}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.avatarContainer,
          {
            transform: [{translateY: y}],
          },
        ]}>
        <Avatar id={id} url={avatar} />
      </Animated.View>

      <Animated.View
        style={[
          styles.nameContainer,
          {
            transform: [{translateY: y}],
          },
        ]}>
        <Text style={styles.name}>{name}</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.editProfileOrSendMessageButtonContainer,
          {
            transform: [{translateY: y}],
          },
        ]}>
        {isMe ? <EditButton /> : <SendMessageButton id={id} />}
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
        style={[styles.snsIconsContainer, {transform: [{translateY: y}]}]}>
        <SnsIcons snsLinkData={snsLinkData} />
      </Animated.View>

      {isMe && (
        <View style={styles.takeWideRangeSourceContainer}>
          <TakeFlashButton />
        </View>
      )}

      {isMe && <Menu />}
    </View>
  );
};

const {height} = Dimensions.get('screen');

export const oneIntroduceTextLineHeght = 19.7;
const introduceContainerHeight = height * 0.14;
const snsIconsContainerTop = profileContainerHeight - stickyTabHeight - 12;

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
  avatarContainer: {
    position: 'absolute',
    top: avatarContainerTop,
    left: nameAndAvatarLeft,
  },
  nameContainer: {
    position: 'absolute',
    top: nameContainerTop,
    left: nameAndAvatarLeft,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  editProfileOrSendMessageButtonContainer: {
    position: 'absolute',
    width: '40%',
    top: editProfileOrSendMessageButtonContainerTop,
    right: '4%',
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
    position: 'absolute',
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
  creatingFlashContaienr: {
    position: 'absolute',
    top: creatingFlashContainerTop,
    left: 108,
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

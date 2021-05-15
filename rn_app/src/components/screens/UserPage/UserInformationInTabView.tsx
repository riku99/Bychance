import React, {useState, useMemo, useCallback} from 'react';
import {StyleSheet, View, Linking} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';
import {SocialIcon} from 'react-native-elements';
import TikTok from '~/assets/tiktok_logo.svg';

import {stickyTabHeight} from './TabView';
import {RootState} from '~/stores';
import {snsBaseUrl} from '~/constants/sns';

type Props = {
  containerHeight: number;
  profileContainerHeight: number;
  mostRecentlyScrolledView: 'Posts' | 'UserInformation' | null;
};

export const UserInformationRouteInTabView = React.memo(
  ({
    containerHeight,
    profileContainerHeight,
    mostRecentlyScrolledView,
  }: Props) => {
    const [contentsHeight, setContentsHeight] = useState(0);

    const paddingTopHeight = useMemo(
      () => profileContainerHeight + stickyTabHeight,
      [profileContainerHeight],
    );

    const scrollableHeight = useMemo(() => {
      switch (mostRecentlyScrolledView) {
        case 'UserInformation':
          return paddingTopHeight;
        case 'Posts':
          return containerHeight + profileContainerHeight - contentsHeight; // 上部に到達したTabまでスクロールできる高さを持たせる
      }
    }, [
      containerHeight,
      contentsHeight,
      mostRecentlyScrolledView,
      paddingTopHeight,
      profileContainerHeight,
    ]);

    const linkData = useSelector((state: RootState) => {
      const {instagram, twitter, youtube, tiktok} = state.userReducer.user!;
      return {instagram, twitter, youtube, tiktok};
    }, shallowEqual);

    const handleSnsIconPress = useCallback(async (link: string) => {
      const supported = await Linking.canOpenURL(link);

      if (supported) {
        await Linking.openURL(link);
      } else {
        console.log('無効なリンクです');
      }
    }, []);

    return (
      <>
        <View
          style={{
            minHeight:
              containerHeight - (profileContainerHeight + stickyTabHeight),
          }}
          onLayout={(e) => setContentsHeight(e.nativeEvent.layout.height)}>
          <View style={styles.iconContainer}>
            {linkData.instagram && (
              <SocialIcon
                raised={false}
                type="instagram"
                onPress={() =>
                  handleSnsIconPress(
                    `${snsBaseUrl.instagramBaseUrl}/${linkData.instagram}`,
                  )
                }
                style={[styles.socialIcom, {backgroundColor: 'pink'}]}
              />
            )}
            {linkData.twitter && (
              <SocialIcon
                raised={false}
                type="twitter"
                onPress={() =>
                  handleSnsIconPress(
                    `${snsBaseUrl.twitterBaseUrl}/${linkData.twitter}`,
                  )
                }
                style={styles.socialIcom}
              />
            )}
            {linkData.youtube && (
              <SocialIcon
                raised={false}
                type="youtube"
                onPress={() => handleSnsIconPress(linkData.youtube!)}
                style={styles.socialIcom}
              />
            )}
            {linkData.tiktok && (
              <TikTok
                width={52}
                style={{marginLeft: 10}}
                onPress={() =>
                  handleSnsIconPress(
                    `${snsBaseUrl.tiktokBaseUrl}/@${linkData.tiktok}`,
                  )
                }
              />
            )}
          </View>
        </View>
        <View style={{height: scrollableHeight}} />
      </>
    );
  },
);

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    marginTop: 20,
    width: '64%',
  },
  socialIcom: {
    width: 52,
    height: 52,
    marginLeft: 10,
  },
});

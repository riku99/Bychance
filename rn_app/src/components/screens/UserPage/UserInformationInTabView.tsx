import React, {useState, useMemo, useCallback} from 'react';
import {StyleSheet, View, Linking, Alert} from 'react-native';
import {SocialIcon} from 'react-native-elements';
import TikTok from '~/assets/tiktok_logo.svg';

import {stickyTabHeight} from './TabView';
import {snsBaseUrl} from '~/constants/sns';

export type SnsLinkData = {
  instagram: string | null;
  twitter: string | null;
  youtube: string | null;
  tiktok: string | null;
};

type Props = {
  containerHeight: number;
  profileContainerHeight: number;
  mostRecentlyScrolledView: 'Posts' | 'UserInformation' | null;
  snsLinkData: SnsLinkData;
};

export const UserInformationRouteInTabView = React.memo(
  ({
    containerHeight,
    profileContainerHeight,
    mostRecentlyScrolledView,
    snsLinkData,
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

    const handleSnsIconPress = useCallback(async (link: string) => {
      const notSupportedAlert = () => {
        Alert.alert('無効なURLです', '', [
          {
            text: 'かしこまりまし子',
          },
        ]);
      };

      try {
        const supported = await Linking.canOpenURL(link);

        if (supported) {
          await Linking.openURL(link);
        } else {
          notSupportedAlert();
        }
      } catch (e) {
        notSupportedAlert();
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
            {snsLinkData.instagram && (
              <SocialIcon
                raised={false}
                type="instagram"
                onPress={() =>
                  handleSnsIconPress(
                    `${snsBaseUrl.instagramBaseUrl}/${snsLinkData.instagram}`,
                  )
                }
                style={[styles.socialIcom, {backgroundColor: 'pink'}]}
              />
            )}
            {snsLinkData.twitter && (
              <SocialIcon
                raised={false}
                type="twitter"
                onPress={() =>
                  handleSnsIconPress(
                    `${snsBaseUrl.twitterBaseUrl}/${snsLinkData.twitter}`,
                  )
                }
                style={styles.socialIcom}
              />
            )}
            {snsLinkData.youtube && (
              <SocialIcon
                raised={false}
                type="youtube"
                onPress={() => handleSnsIconPress(snsLinkData.youtube!)}
                style={styles.socialIcom}
              />
            )}
            {snsLinkData.tiktok && (
              <TikTok
                width={52}
                style={{marginLeft: 10}}
                onPress={() =>
                  handleSnsIconPress(
                    `${snsBaseUrl.tiktokBaseUrl}/@${snsLinkData.tiktok}`,
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

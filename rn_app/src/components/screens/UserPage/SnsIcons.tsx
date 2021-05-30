import React, {useCallback} from 'react';
import {StyleSheet, View, Alert, Linking} from 'react-native';
import {SocialIcon} from 'react-native-elements';
import TikTok from '~/assets/tiktok_logo.svg';

import {snsBaseUrl} from '~/constants/sns';

export type SnsLinkData = {
  instagram: string | null;
  twitter: string | null;
  youtube: string | null;
  tiktok: string | null;
};

type Props = {
  snsLinkData: SnsLinkData;
};

export const SnsIcons = React.memo(({snsLinkData}: Props) => {
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
      <View>
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
              width={38}
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
    </>
  );
});

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  socialIcom: {
    width: 38,
    height: 38,
    marginLeft: 9,
  },
});

import React, {useCallback} from 'react';
import {StyleSheet, View, Alert, Linking} from 'react-native';
import {SocialIcon} from 'react-native-elements';
import TikTok from '~/assets/tiktok_logo.svg';

import {snsBaseUrl} from '~/constants/sns';

export type SnsLinkData = {
  instagram?: string | null;
  twitter?: string | null;
  youtube?: string | null;
  tiktok?: string | null;
};

type Props = {
  snsLinkData?: SnsLinkData;
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

  if (!snsLinkData) {
    return null;
  }

  return (
    <View style={styles.iconContainer}>
      {snsLinkData.instagram && (
        <SocialIcon
          raised={false}
          type="instagram"
          underlayColor="pink"
          onPress={() =>
            handleSnsIconPress(
              `${snsBaseUrl.instagramBaseUrl}/${snsLinkData.instagram}`,
            )
          }
          style={[styles.socialIcon, {backgroundColor: 'pink'}]}
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
          style={styles.socialIcon}
        />
      )}
      {snsLinkData.youtube && (
        <SocialIcon
          raised={false}
          type="youtube"
          onPress={() => handleSnsIconPress(snsLinkData.youtube!)}
          style={styles.socialIcon}
        />
      )}
      {snsLinkData.tiktok && (
        <TikTok
          height="100%"
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
  );
});

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 55,
  },
  socialIcon: {
    width: 38,
    height: 38,
    marginLeft: 9,
  },
});

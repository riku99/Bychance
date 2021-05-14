import React from 'react';
import {StyleSheet, View} from 'react-native';
import {SocialIcon} from 'react-native-elements';

import TikTok from '~/assets/tiktok_logo.svg';
import {SnsList} from '~/types';

type Props = {
  showSnsModal: (snsType: SnsList) => void;
};

export const SnsIconList = React.memo(({showSnsModal}: Props) => {
  return (
    <View style={styles.container}>
      <SocialIcon
        raised={false}
        type="instagram"
        style={[
          styles.icon,
          {
            backgroundColor: 'pink',
          },
        ]}
        onPress={() => showSnsModal('instagram')}
      />
      <SocialIcon
        raised={false}
        type="twitter"
        style={styles.icon}
        onPress={() => showSnsModal('twitter')}
      />
      <SocialIcon
        raised={false}
        type="youtube"
        style={styles.icon}
        onPress={() => showSnsModal('youtube')}
      />
      <TikTok
        width={40}
        style={{marginLeft: 6}}
        onPress={() => showSnsModal('tiktok')}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  icon: {
    width: 40,
    height: 40,
    alignSelf: 'center',
  },
});

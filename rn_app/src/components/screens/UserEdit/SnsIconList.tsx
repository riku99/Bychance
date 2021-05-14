import React from 'react';
import {StyleSheet, View} from 'react-native';
import {SocialIcon} from 'react-native-elements';
import TikTok from '~/assets/tiktok_logo.svg';

type Props = {};

export const SnsIconList = React.memo(() => {
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
      />
      <SocialIcon raised={false} type="twitter" style={styles.icon} />
      <SocialIcon raised={false} type="youtube" style={styles.icon} />
      <TikTok width={40} style={{marginLeft: 6}} />
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

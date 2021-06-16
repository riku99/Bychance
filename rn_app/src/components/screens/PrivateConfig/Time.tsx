import React, {useCallback, useRef} from 'react';
import {StyleSheet, View, Text, SafeAreaView} from 'react-native';
import {Button, Divider} from 'react-native-elements';

import {commonStyles} from './common';
import {AboutPrivateTimeModal} from './AboutPrivateTimeModal';
import {Modalize} from 'react-native-modalize';

export const Time = React.memo(() => {
  const aboutPrivateTimeModalRef = useRef<Modalize>(null);

  const onAboutPrivateTimeButtonPress = useCallback(() => {
    if (aboutPrivateTimeModalRef.current) {
      aboutPrivateTimeModalRef.current.open();
    }
  }, []);
  return (
    <View style={styles.container}>
      <Button
        title="プライベートタイムとは?"
        titleStyle={commonStyles.descriptionButtonTitle}
        buttonStyle={commonStyles.descriptionButton}
        activeOpacity={1}
        onPress={onAboutPrivateTimeButtonPress}
      />
      <AboutPrivateTimeModal modalRef={aboutPrivateTimeModalRef} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSafeArea} from '~/hooks/appState';
import {useMyAvatar} from '~/hooks/users';
import {UserAvatar} from '~/components/utils/Avatar';
import {Button} from 'react-native-elements';

export const GetCall = () => {
  const {top} = useSafeArea();
  const image = useMyAvatar();

  return (
    <View style={[styles.container, {top}]}>
      <Text style={styles.name}>Riku</Text>
      <View style={styles.buttonGroup}>
        <Button
          icon={{name: 'call', color: 'white', size: 28}}
          buttonStyle={[styles.button, {backgroundColor: '#05f55d'}]}
        />
        <Button
          icon={{name: 'call-end', color: 'white', size: 28}}
          buttonStyle={[styles.button, {backgroundColor: '#f51505'}]}
        />
      </View>
      <UserAvatar
        image={image}
        size={54}
        containerStyle={styles.imageContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '94%',
    height: 140,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignSelf: 'center',
    borderRadius: 30,
    padding: 20,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
  },
  imageContainer: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  buttonGroup: {
    marginTop: 22,
    flexDirection: 'row',
    width: '56%',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 52,
    width: 52,
    height: 52,
    padding: 0,
  },
});

import React, {useEffect, useState, useRef} from 'react';
import {Switch, Dimensions, View, StyleSheet} from 'react-native';
import {ListItem} from 'react-native-elements';
import {Modalize} from 'react-native-modalize';

type Props = {
  isVisble: boolean;
  userDisplay: boolean;
  displayMenu: () => void;
  changeUserDisplay: (display: boolean) => void;
};

export const Menu = ({
  isVisble,
  userDisplay,
  displayMenu,
  changeUserDisplay,
}: Props) => {
  const [displaySwitch, setDisplaySwitch] = useState(userDisplay);
  const list = [
    {
      title: '他のユーザーに自分を表示',
      titleStyle: {fontSize: 15, color: '#575757'},
      onPress: async () => {},
      addComponent: (
        <Switch
          value={displaySwitch}
          style={{transform: [{scaleX: 0.8}, {scaleY: 0.8}]}}
          onValueChange={() => {
            if (displaySwitch) {
              setDisplaySwitch(false);
              changeUserDisplay(false);
            } else {
              setDisplaySwitch(true);
              changeUserDisplay(true);
            }
          }}
        />
      ),
    },
  ];
  const modalizeRef = useRef<Modalize>(null);
  useEffect(() => {
    if (isVisble) {
      modalizeRef.current?.open();
    }
  }, [isVisble]);

  return (
    <Modalize ref={modalizeRef} modalHeight={height / 2} onClose={displayMenu}>
      <View style={styles.inModalContainer}>
        {list.map((l, i) => {
          return (
            <ListItem key={i} onPress={l.onPress}>
              <ListItem.Content>
                <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
              </ListItem.Content>
              {l.addComponent}
            </ListItem>
          );
        })}
      </View>
    </Modalize>
  );
};

const {height} = Dimensions.get('window');

const styles = StyleSheet.create({
  inModalContainer: {
    width: '97%',
    alignSelf: 'center',
    marginTop: 10,
  },
});

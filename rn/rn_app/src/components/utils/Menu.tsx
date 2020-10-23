import React, {useState} from 'react';
import {Switch} from 'react-native';
import {BottomSheet, ListItem} from 'react-native-elements';

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
      titleStyle: {},
      onPress: async () => {},
      addComponent: (
        <Switch
          value={displaySwitch}
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
    {
      title: 'メニューを閉じる',
      titleStyle: {color: 'red'},
      onPress: () => {
        displayMenu();
      },
    },
  ];
  return (
    <BottomSheet isVisible={isVisble} modalProps={{}}>
      {list.map((l, i) => {
        return (
          <ListItem key={i} onPress={l.onPress} topDivider={true}>
            <ListItem.Content>
              <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
            </ListItem.Content>
            {l.addComponent}
          </ListItem>
        );
      })}
    </BottomSheet>
  );
};

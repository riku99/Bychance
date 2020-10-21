import React from 'react';
import {BottomSheet, ListItem} from 'react-native-elements';
import {useDispatch} from 'react-redux';

import {displayMenu} from '../../redux/index';

type Props = {isVisble: boolean};

export const Menu = ({isVisble}: Props) => {
  const dispatch = useDispatch();

  const list = [
    {
      title: 'メニューを閉じる',
      titleStyle: {color: 'red'},
      onPress: () => {
        dispatch(displayMenu());
      },
    },
  ];
  return (
    <BottomSheet isVisible={isVisble} modalProps={{}}>
      {list.map((l, i) => {
        return (
          <ListItem key={i} onPress={l.onPress}>
            <ListItem.Content>
              <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        );
      })}
    </BottomSheet>
  );
};

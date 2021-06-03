import React from 'react';
import {StyleSheet} from 'react-native';
import {ListItem} from 'react-native-elements';

type List = {
  title: string;
  switch?: JSX.Element;
}[];

type Props = {
  list: List;
};

export const ConfigList = React.memo(({list}: Props) => {
  return (
    <>
      {list.map((l, i) => (
        <ListItem
          key={i}
          bottomDivider
          topDivider={i === 0 ? true : false}
          containerStyle={styles.listContainer}>
          <ListItem.Content>
            <ListItem.Title>{l.title}</ListItem.Title>
          </ListItem.Content>
          {l.switch && l.switch}
        </ListItem>
      ))}
    </>
  );
});

const styles = StyleSheet.create({
  listContainer: {
    height: 45,
  },
  switch: {
    transform: [{scaleX: 0.8}, {scaleY: 0.8}],
  },
});

import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ListItem} from 'react-native-elements';
import MIcon from 'react-native-vector-icons/MaterialIcons';

export type List = {
  title: string;
  switch?: JSX.Element;
  description?: boolean;
  onItemPress?: () => void;
}[];

type Props = {
  list: List;
};

export const ConfigList = React.memo(({list}: Props) => {
  return (
    <>
      {/* <Text style={{marginBottom: 15}}>
        <MIcon name="info" size={14} style={{marginLeft: 5}} />
        マークがあるリストをタップすると説明が表示されます
      </Text> */}
      {list.map((l, i) => (
        <ListItem
          key={i}
          bottomDivider
          topDivider={i === 0 ? true : false}
          containerStyle={styles.listContainer}
          onPress={() => {
            if (l.onItemPress) {
              l.onItemPress();
            }
          }}>
          <ListItem.Content>
            <View style={{flexDirection: 'row'}}>
              <ListItem.Title>{l.title}</ListItem.Title>
              {l.description && (
                <MIcon
                  name="info"
                  size={17}
                  color="#000445"
                  style={{marginLeft: 5}}
                />
              )}
            </View>
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

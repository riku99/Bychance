import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import {Button} from 'react-native-elements';
import Emoji from 'react-native-emoji';

type Props = {
  onPress: () => void;
};

// こっちで処理をまとめることもできる(onPressで渡される関数をこのコンポーネントで実装する)けど画像か動画かなど条件が複雑になってきたら処理も複雑になると思われるので
// 多くの条件に関するpropsを受けて処理を記述するよりも関数そのものを受けた方が多分やりやすいので関数をそのものをもらうようにしている
export const PostFlashButton = React.memo(({onPress}: Props) => {
  return (
    // <Button
    //   activeOpacity={1}
    //   title="のせる"
    //   buttonStyle={styles.buttonStyle}
    //   titleStyle={styles.titleStyle}
    //   onPress={onPress}
    // />
    <TouchableOpacity style={styles.buttonStyle}>
      <Text style={styles.titleStyle}>のせる</Text>
      <Emoji name="balloon" />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonStyle: {
    borderRadius: 30,
    width: 100,
    height: 45,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleStyle: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 18,
  },
});

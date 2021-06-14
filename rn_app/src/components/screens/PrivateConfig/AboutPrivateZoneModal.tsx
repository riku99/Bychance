import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {Modalize} from 'react-native-modalize';

type Props = {
  modalRef: React.MutableRefObject<Modalize | null>;
};

export const AboutPrivateZoneModal = React.memo(({modalRef}: Props) => {
  return (
    <Modalize ref={modalRef} modalHeight={height * 0.8}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>プライベートゾーンとは</Text>
        <Text style={styles.explanation}>
          他のユーザーに対して自動で自分を表示させなくする場所のことです。
          {'\n'}
          {'\n'}
          プライベートゾーンに指定した場所から一定の範囲内に自分がいる場合、例え設定で「他のユーザーに自分を表示」をオンにしていても他のユーザーに自分が表示されなくなります。
          {'\n'}
          {'\n'}
          「一定の範囲内」はだいたい半径500m ~
          1kmほどです。正確な数字は防犯上の関係でお伝えできません。
          {'\n'}
          {'\n'}
          プライベートゾーンは複数登録することができます。
          {'\n'}
          {'\n'}
          なお、プライベートゾーンにいる場合でも、他のユーザーに自分を表示させたくない場合は設定で「他のユーザーに自分を表示」をオフにすることを推奨します。
        </Text>
      </View>
    </Modalize>
  );
});

const {height} = Dimensions.get('screen');

const styles = StyleSheet.create({
  modalContainer: {
    marginHorizontal: 10,
    marginTop: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  explanation: {
    marginTop: 15,
    lineHeight: 17,
    fontSize: 16,
    color: '#4d4d4d',
  },
});

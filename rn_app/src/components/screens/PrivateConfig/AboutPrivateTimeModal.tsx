import React from 'react';
import {Dimensions, Text, View} from 'react-native';
import {Modalize} from 'react-native-modalize';

import {commonModalStyles} from './common';

type Props = {
  modalRef: React.MutableRefObject<Modalize | null>;
};

export const AboutPrivateTimeModal = React.memo(({modalRef}: Props) => {
  return (
    <Modalize ref={modalRef} modalHeight={height * 0.8}>
      <View style={commonModalStyles.modalContainer}>
        <Text style={commonModalStyles.title}>プライベートタイムとは</Text>
        <Text style={commonModalStyles.explanation}>
          他のユーザーに対して自動で自分を表示させなくする時間のことです。
          {'\n'}
          {'\n'}
          プライベートタイムに設定した時間内である場合、例え設定で「他のユーザーに自分を表示」をオンにしていても他のユーザーに自分が表示されなくなります。🙅‍♀️
          {'\n'}
          {'\n'}
          プライベートタイムは複数登録することができます。🔢
          {'\n'}
          {'\n'}
          プライベートタイム中でも、他のユーザーに自分を表示させたくない場合は設定で「他のユーザーに自分を表示」をオフにすることを推奨します。🙇‍♂️
        </Text>
      </View>
    </Modalize>
  );
});

const {height} = Dimensions.get('screen');

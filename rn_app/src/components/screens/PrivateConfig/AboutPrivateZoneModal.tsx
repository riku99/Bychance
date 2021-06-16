import React from 'react';
import {Dimensions, Text, View} from 'react-native';
import {Modalize} from 'react-native-modalize';

import {commonModalStyles} from './common';

type Props = {
  modalRef: React.MutableRefObject<Modalize | null>;
};

export const AboutPrivateZoneModal = React.memo(({modalRef}: Props) => {
  return (
    <Modalize ref={modalRef} modalHeight={height * 0.8}>
      <View style={commonModalStyles.modalContainer}>
        <Text style={commonModalStyles.title}>プライベートゾーンとは</Text>
        <Text style={commonModalStyles.explanation}>
          他のユーザーに対して自動で自分を表示させなくする場所のことです。
          {'\n'}
          {'\n'}
          プライベートゾーンに指定した場所から一定の範囲内に自分がいる場合、例え設定で「他のユーザーに自分を表示」をオンにしていても他のユーザーに自分が表示されなくなります。🙅‍♀️
          {'\n'}
          {'\n'}
          「一定の範囲内」はだいたい半径500m ~
          1kmほどです。正確な数字は防犯上の関係でお伝えできません。㊙️
          {'\n'}
          {'\n'}
          プライベートゾーンは複数登録することができます。🔢
          {'\n'}
          {'\n'}
          プライベートゾーンにいる場合でも、他のユーザーに自分を表示させたくない場合は設定で「他のユーザーに自分を表示」をオフにすることを推奨します。🙇‍♂️
          {'\n'}
          {'\n'}
          なお、プライベートゾーンも現在地情報と同様に暗号化して保存されます。
        </Text>
      </View>
    </Modalize>
  );
});

const {height} = Dimensions.get('screen');

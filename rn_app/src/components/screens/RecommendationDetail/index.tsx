import React from 'react';
import {View, StyleSheet} from 'react-native';
import {RecommendationDetail as _RecommendationDetail} from 'bychance-components';
import {useRoute, RouteProp} from '@react-navigation/native';
import {Button} from 'react-native-elements';

import {RecommendationStackParamList} from '~/navigations/Recommendation';

export const RecommendationDetail = React.memo(() => {
  const data = useRoute<RouteProp<RecommendationStackParamList, 'Detail'>>();

  return (
    <View style={styles.container}>
      <_RecommendationDetail
        data={data.params}
        BottomButton={() => (
          <Button
            title="非表示にする"
            activeOpacity={1}
            titleStyle={{fontWeight: 'bold'}}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
          />
        )}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    marginTop: 40,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 50,
  },
  button: {
    backgroundColor: 'gray',
    height: 41,
  },
});

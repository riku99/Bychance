import React, {useCallback} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {RecommendationDetail as _RecommendationDetail} from 'bychance-components';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {Button} from 'react-native-elements';

import {RecommendationStackParamList} from '~/navigations/Recommendation';
import {useHideRecommendation} from '~/hooks/recommendations';

export const RecommendationDetail = React.memo(() => {
  const {setListData, ...data} = useRoute<
    RouteProp<RecommendationStackParamList, 'Detail'>
  >().params;

  const navigation = useNavigation();

  const {hideRecommendation} = useHideRecommendation();

  const onHideButtonPress = useCallback(() => {
    Alert.alert('非表示にしますか?', '再度表示することはできません', [
      {
        text: '非表示',
        style: 'destructive',
        onPress: async () => {
          await hideRecommendation({id: data.id});
          setListData((current) => current.filter((d) => d.id !== data.id));
          navigation.goBack();
        },
      },
      {
        text: 'キャンセル',
      },
    ]);
  }, [data.id, setListData, hideRecommendation, navigation]);

  return (
    <View style={styles.container}>
      <_RecommendationDetail
        data={data}
        BottomButton={() => (
          <Button
            title="非表示にする"
            activeOpacity={1}
            titleStyle={{fontWeight: 'bold'}}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            onPress={onHideButtonPress}
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

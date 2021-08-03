import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {RecommendationList} from '~/components/screens/RecommendationList';

type RecommendationStackParamList = {
  List: undefined;
};

const Stack = createStackNavigator<RecommendationStackParamList>();

export const RecommendationStackScreen = React.memo(() => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="List"
        component={RecommendationList}
        options={{headerTitle: '近くのおすすめ'}}
      />
    </Stack.Navigator>
  );
});

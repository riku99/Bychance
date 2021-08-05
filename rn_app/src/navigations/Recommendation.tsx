import React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {Recommendation} from 'bychance-components';

import {RecommendationList} from '~/components/screens/RecommendationList';
import {RecommendationDetail} from '~/components/screens/RecommendationDetail';

export type RecommendationStackParamList = {
  List: undefined;
  Detail: Recommendation & {
    setListData: React.Dispatch<React.SetStateAction<Recommendation[]>>;
  };
};

export type RecommendationsNavigationProp<
  T extends keyof RecommendationStackParamList
> = StackNavigationProp<RecommendationStackParamList, T>;

const Stack = createStackNavigator<RecommendationStackParamList>();

export const RecommendationStackScreen = React.memo(() => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="List"
        component={RecommendationList}
        options={{headerTitle: '近くのおすすめ'}}
      />
      <Stack.Screen
        name="Detail"
        component={RecommendationDetail}
        options={{
          headerTransparent: true,
          headerBackTitleVisible: false,
          headerTitle: '',
          headerTintColor: 'white',
        }}
      />
    </Stack.Navigator>
  );
});

import React, {ComponentProps, useCallback} from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';

import {Container as Post} from '../components/screens/Post';
import {UserPage} from '~/components/screens/UserPage';

export type PostScreenType = {
  id: number;
  url: string;
  text: string | null;
  userId: string;
  createdAt: string;
  sourceType: 'image' | 'video';
};

export type UserPageNavigationProp<
  T extends keyof UserPageScreenGroupParamList
> = StackNavigationProp<UserPageScreenGroupParamList, T>;

export type UserPageScreenGroupParamList = {
  UserPage: {
    userId: string;
  };
  Post: PostScreenType;
};

// stackで使われるscreenのグループ。Tabに渡されるMyPageStackScreenとは分けて使う
const userPageScreensGroup = {
  UserPage: UserPage,
  Post: Post,
};

const Stack = createStackNavigator<UserPageScreenGroupParamList>();

export const useUserPageStackList = () => {
  const renderUserPageStackList = useCallback(
    (props?: {options: ComponentProps<typeof Stack.Screen>['options']}) => {
      return Object.entries(userPageScreensGroup).map(([name, component]) => (
        <Stack.Screen
          key={name}
          name={name as keyof UserPageScreenGroupParamList}
          component={component}
          options={({route}) => ({
            headerTitle: route.name === 'Post' ? '投稿' : undefined,
            ...props?.options,
          })}
        />
      ));
    },
    [],
  );

  return {
    renderUserPageStackList,
  };
};

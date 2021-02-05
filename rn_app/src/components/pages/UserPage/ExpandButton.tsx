import React from 'react';
import {ScrollView} from 'react-native';
import {Button} from 'react-native-elements';
import MIcon from 'react-native-vector-icons/MaterialIcons';

type Props = {
  expandedIntroduceContainer: boolean;
  setExpandedIntroduceContainer: React.Dispatch<React.SetStateAction<boolean>>;
  postsTabViewRef: React.RefObject<ScrollView>;
  userInformationTabViewRef: React.RefObject<ScrollView>;
};

export const ExpandButton = React.memo(
  ({
    expandedIntroduceContainer,
    setExpandedIntroduceContainer,
    postsTabViewRef,
    userInformationTabViewRef,
  }: Props) => {
    const onPress = () => {
      // introduceを広げている状態から閉じた場合、0にスクロールされる
      if (expandedIntroduceContainer) {
        postsTabViewRef.current?.scrollTo({y: 0, animated: false});
        userInformationTabViewRef.current?.scrollTo({y: 0, animated: false});
      }
      setExpandedIntroduceContainer(!expandedIntroduceContainer);
    };

    return (
      <Button
        icon={
          <MIcon
            name={!expandedIntroduceContainer ? 'expand-more' : 'expand-less'}
            size={30}
            style={{color: '#5c94c8'}}
          />
        }
        buttonStyle={{backgroundColor: 'transparent'}}
        onPress={onPress}
      />
    );
  },
);

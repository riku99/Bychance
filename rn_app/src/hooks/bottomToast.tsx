import React, {useEffect} from 'react';
import {Dimensions} from 'react-native';
import {useToast} from 'react-native-fast-toast';
import {useSelector} from 'react-redux';
import MIcon from 'react-native-vector-icons/MaterialIcons';

import {RootState} from '~/stores';

export const useSetupBottomToast = () => {
  const toast = useToast();

  const bottomToastData = useSelector(
    (state: RootState) => state.bottomToastReducer.data,
  );

  useEffect(() => {
    if (bottomToastData) {
      toast?.show(bottomToastData.message, {
        type: bottomToastData.type,
        // icon: <MIcon name="priority-high" color="white" size={17} />,
        successIcon: <MIcon name="done" color="white" size={17} />,
        dangerIcon: <MIcon name="clear" color="white" size={17} />,
        style: {
          width: bottomToastWidth,
        },
      });
    }
  }, [bottomToastData, toast]);
};

const {width} = Dimensions.get('screen');

const bottomToastWidth = width * 0.9;

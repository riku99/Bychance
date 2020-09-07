import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import LineLogin from '@xmartlabs/react-native-line';
import {useDispatch} from 'react-redux';
import {postJWT} from './redux/user';

const Root: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(postJWT({name: 'riku'}));
  });
  return (
    <>
      <View>
        <Text>ok</Text>
      </View>
    </>
  );
};

export default Root;

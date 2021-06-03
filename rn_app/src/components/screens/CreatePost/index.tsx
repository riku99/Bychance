import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {TextInput} from 'react-native-gesture-handler';
import {Button} from 'react-native-elements';
import {launchImageLibrary} from 'react-native-image-picker';
import fs from 'react-native-fs';

import {AppDispatch} from '../../../stores';
import {creatingPost} from '../../../stores/otherSettings';
import {createPostThunk} from '../../../apis/posts/createPost';
import {CreatePostStackNavigationProp} from '../../../screens/types';
import {displayShortMessage} from '../../../helpers/shortMessages/displayShortMessage';
import {getExtention} from '~/utils';

type Props = {
  navigation: CreatePostStackNavigationProp<'CreatePostTable'>;
};

export const CreatePost = ({navigation}: Props) => {
  const isFocused = useIsFocused();

  const [uri, setUri] = useState<string>();
  const [text, setText] = useState('');

  const dispatch: AppDispatch = useDispatch();

  const createPost = useCallback(async () => {
    if (uri) {
      dispatch(creatingPost());
      navigation.goBack();
      const ext = getExtention(uri);
      if (!ext) {
        displayShortMessage('無効なデータです', 'warning');
        dispatch(creatingPost());
        return;
      }
      const source = await fs.readFile(uri, 'base64');
      const result = await dispatch(createPostThunk({text, source, ext}));
      if (createPostThunk.fulfilled.match(result)) {
        displayShortMessage('投稿しました', 'success');
      }
      dispatch(creatingPost());
    }
  }, [dispatch, navigation, uri, text]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: uri
        ? () => (
            <Button
              title="投稿"
              buttonStyle={{backgroundColor: 'transparent'}}
              titleStyle={{color: '#5c94c8', fontWeight: 'bold'}}
              onPress={createPost}
            />
          )
        : undefined,
    });
  }, [navigation, uri, text, dispatch, createPost]);

  useEffect(() => {
    if (isFocused) {
      launchImageLibrary({quality: 1, mediaType: 'photo'}, (response) => {
        if (response.didCancel || !response.uri) {
          navigation.goBack();
          return;
        }

        setUri(response.uri);
      });
    } else {
      setUri(undefined);
    }
  }, [isFocused, navigation]);

  useEffect(() => {
    if (!isFocused) {
      setText('');
    }
  }, [isFocused]);

  return (
    <>
      {uri ? (
        <View style={styles.container}>
          <View style={styles.contents}>
            {uri ? (
              <Image source={{uri: uri}} style={styles.image} />
            ) : (
              <View style={{...styles.image, justifyContent: 'center'}}>
                <ActivityIndicator size="small" />
              </View>
            )}
            <TextInput
              style={styles.textInputArea}
              multiline={true}
              placeholder="テキストの入力"
              onChangeText={(t) => {
                setText(t);
              }}>
              {text}
            </TextInput>
          </View>
        </View>
      ) : (
        <View style={{...styles.container, justifyContent: 'center'}}>
          <ActivityIndicator />
        </View>
      )}
    </>
  );
};

const {height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  contents: {
    width: '100%',
    height: '19%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: height / 9,
    height: height / 9,
    marginLeft: 15,
  },
  textInputArea: {
    height: height / 9,
    width: '67%',
    marginLeft: 15,
  },
});

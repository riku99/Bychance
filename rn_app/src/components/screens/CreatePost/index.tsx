import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  Dimensions,
  TextInput,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {Button} from 'react-native-elements';
import {launchImageLibrary} from 'react-native-image-picker';
import fs from 'react-native-fs';
import Video from 'react-native-video';
import {RNToasty} from 'react-native-toasty';

import {CreatePostStackNavigationProp} from '../../../navigations/types';
import {getExtention} from '~/utils';
import {useCustomDispatch} from '~/hooks/stores';
import {useCreatePost} from '~/hooks/posts';
import {addPost} from '~/stores/posts';
import {useCreateingPost} from '~/hooks/appState';
import {defaultTheme} from '~/theme';

type Props = {
  navigation: CreatePostStackNavigationProp<'CreatePostTable'>;
};

export const CreatePost = ({navigation}: Props) => {
  const isFocused = useIsFocused();
  const {setCreatingPost} = useCreateingPost();

  const [data, setData] = useState<{
    uri: string;
    sourceType: 'image' | 'video';
  } | null>();
  const [text, setText] = useState('');
  const dispatch = useCustomDispatch();
  const {createPost} = useCreatePost();

  const onPress = useCallback(async () => {
    if (data?.uri) {
      if (text.length > 150) {
        RNToasty.Show({
          title: 'テキストは150文字以下にしてください',
          position: 'center',
        });
        return;
      }
      setCreatingPost(true);
      navigation.goBack();
      const ext = getExtention(data.uri);
      if (!ext) {
        RNToasty.Show({
          title: '無効なデータです',
          position: 'center',
        });
        setCreatingPost(false);
        return;
      }
      const source = await fs.readFile(data.uri, 'base64');
      const result = await createPost({
        text,
        source,
        ext,
        sourceType: data.sourceType,
      });
      if (result) {
        dispatch(addPost(result));
      }
      setCreatingPost(false);
    }
  }, [setCreatingPost, dispatch, navigation, data, text, createPost]);

  useEffect(() => {
    navigation.setOptions({
      title: '写真の投稿',
      headerLeft: () => (
        <Button
          title="キャンセル"
          style={{marginBottom: 3}}
          titleStyle={{color: defaultTheme.primary}}
          buttonStyle={{backgroundColor: 'transparent'}}
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
      headerRight: data?.uri
        ? () => (
            <Button
              title="投稿"
              buttonStyle={{backgroundColor: 'transparent'}}
              titleStyle={{
                color: defaultTheme.primary,
                fontWeight: 'bold',
              }}
              onPress={onPress}
              activeOpacity={1}
            />
          )
        : undefined,
      // headerStatusBarHeight: getHeaderStatusBarHeight(),
    });
  }, [navigation, data, text, dispatch, createPost, onPress]);

  useEffect(() => {
    if (isFocused) {
      launchImageLibrary({quality: 0.7, mediaType: 'mixed'}, (response) => {
        if (response.didCancel) {
          navigation.goBack();
          return;
        }

        const asset = response.assets[0];
        const uri = asset.uri;
        const _type = asset.type;

        if (!uri) {
          navigation.goBack();
          return;
        }

        if (_type) {
          if (!asset.fileSize || asset.fileSize > 8000000) {
            RNToasty.Show({
              title: '8MB以下の画像にしてください',
              position: 'center',
            });
            navigation.goBack();
            return;
          }
          setData({
            uri,
            sourceType: 'image',
          });
        } else {
          const duration = asset.duration;
          if (!duration || duration > 30) {
            RNToasty.Show({
              title: '30秒以下の動画にしてください',
              position: 'center',
            });
            navigation.goBack();
            return;
          }
          setData({
            uri,
            sourceType: 'video',
          });
        }
      });
    }
  }, [isFocused, navigation]);

  useEffect(() => {
    if (!isFocused) {
      setText('');
      setData(null);
    }
  }, [isFocused]);

  if (!data?.uri) {
    return (
      <View style={{...styles.container, justifyContent: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.contents}>
        {data.sourceType === 'image' ? (
          <Image source={{uri: data.uri}} style={styles.source} />
        ) : (
          <Video source={{uri: data.uri}} style={styles.source} repeat={true} />
        )}
        <TextInput
          style={styles.textInputArea}
          multiline={true}
          placeholder="テキストを150文字以内で入力"
          onChangeText={(t) => {
            setText(t);
          }}>
          {text}
        </TextInput>
      </View>
    </View>
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
  source: {
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

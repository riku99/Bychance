import React, {useMemo, useState} from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialIcons';

import {Posts} from '../posts/Posts';
import {basicStyles} from '../../constants/styles';
import {ScrollView} from 'react-native-gesture-handler';
import {Post} from '../../redux/post';
import {Flash} from '../../redux/flashes';
import {UserAvatar} from '../utils/Avatar';
import {UserProfileOuter} from '../utils/UserProfileOuter';

type Props = {
  user: {
    id: number;
    name: string;
    image: string | null;
    introduce: string | null;
  };
  referenceId: number;
  posts: Post[];
  flashes: {
    entites: Flash[];
    isAllAlreadyViewd?: boolean;
  };
  creatingFlash?: boolean;
  navigateToPost: (post: Post) => void;
  navigateToUserEdit?: () => void;
  navigateToChatRoom?: () => Promise<void> | void;
  navigateToTakeFlash?: () => void;
  navigateToFlashes: () => void;
};

export const UserProfile = React.memo(
  ({
    user,
    posts,
    flashes,
    creatingFlash,
    referenceId,
    navigateToPost,
    navigateToUserEdit,
    navigateToChatRoom,
    navigateToTakeFlash,
    navigateToFlashes,
  }: Props) => {
    const lineNumber = useMemo(
      () =>
        user.introduce?.split(/\n|\r\n|\r/).length
          ? user.introduce?.split(/\n|\r\n|\r/).length
          : 0,
      [user.introduce],
    );

    const displayHideButton = useMemo(
      () =>
        lineNumber * oneTextLineHeght > introduceMaxAndMinHight ? true : false,
      [lineNumber],
    );

    const [hideIntroduce, setHideIntroduce] = useState(
      lineNumber * oneTextLineHeght > introduceMaxAndMinHight ? true : false,
    );

    return (
      <View style={styles.container}>
        <ScrollView stickyHeaderIndices={[1]} scrollEventThrottle={16}>
          <View>
            <View style={styles.image}>
              {(flashes.entites.length && !flashes.isAllAlreadyViewd) ||
              creatingFlash ? (
                <UserProfileOuter avatarSize="large" outerType="gradation">
                  <UserAvatar
                    image={user.image}
                    size="large"
                    opacity={1}
                    onPress={() => {
                      navigateToFlashes();
                    }}
                  />
                </UserProfileOuter>
              ) : flashes.entites.length && flashes.isAllAlreadyViewd ? (
                <UserProfileOuter avatarSize="large" outerType="silver">
                  <UserAvatar
                    image={user.image}
                    size="large"
                    opacity={1}
                    onPress={() => {
                      navigateToFlashes();
                    }}
                  />
                </UserProfileOuter>
              ) : (
                <UserAvatar image={user.image} size="large" opacity={1} />
              )}
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{user.name}</Text>
            </View>
            <View style={styles.edit}>
              {referenceId === user.id ? (
                <Button
                  title="プロフィールを編集"
                  titleStyle={styles.editButtonTitle}
                  buttonStyle={styles.editButton}
                  onPress={navigateToUserEdit}
                />
              ) : (
                <Button
                  title="メッセージを送る"
                  icon={
                    <Icon
                      name="send-o"
                      size={15}
                      color="#2c3e50"
                      style={{marginRight: 8}}
                    />
                  }
                  titleStyle={{...styles.editButtonTitle, color: '#2c3e50'}}
                  buttonStyle={[styles.editButton, styles.sendMessageButton]}
                  onPress={navigateToChatRoom}
                />
              )}
            </View>
            <View
              style={[
                styles.introduce,
                {
                  maxHeight: hideIntroduce
                    ? introduceMaxAndMinHight
                    : undefined,
                },
              ]}>
              {!!user.introduce && (
                <Text
                  style={{
                    color: basicStyles.mainTextColor,
                    lineHeight: oneTextLineHeght,
                  }}>
                  {user.introduce}
                </Text>
              )}
            </View>
            {displayHideButton && (
              <Button
                icon={
                  <MIcon
                    name={hideIntroduce ? 'expand-more' : 'expand-less'}
                    size={30}
                    style={{color: '#5c94c8'}}
                  />
                }
                containerStyle={{
                  alignSelf: 'center',
                }}
                buttonStyle={{backgroundColor: 'transparent'}}
                activeOpacity={1}
                onPress={() => setHideIntroduce(!hideIntroduce)}
              />
            )}
          </View>
          <View>
            <View
              style={{
                height: 40,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                backgroundColor: 'white',
              }}>
              <Button
                icon={<MIcon name="apps" size={30} color="#575757" />}
                buttonStyle={{backgroundColor: 'white'}}
              />
            </View>
          </View>
          <View>
            <Posts posts={posts} navigateToShowPost={navigateToPost} />
          </View>
        </ScrollView>
        {referenceId === user.id && (
          <Button
            icon={<MIcon name="flash-on" size={27} style={{color: 'white'}} />}
            containerStyle={styles.storyContainer}
            buttonStyle={styles.stroyButton}
            onPress={navigateToTakeFlash}
          />
        )}
      </View>
    );
  },
);

const {width, height} = Dimensions.get('window');

const oneTextLineHeght = 18.7;

const introduceMaxAndMinHight = height / 5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '8%',
  },
  nameContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '5%',
  },
  name: {
    fontSize: 19,
    marginTop: 3,
    color: basicStyles.mainTextColor,
  },
  edit: {
    alignItems: 'center',
    marginTop: 25,
    height: 40,
  },
  editButton: {
    backgroundColor: 'white',
    width: '90%',
    height: 32,
    borderRadius: 30,
    alignSelf: 'center',
    borderColor: '#4ba5fa',
    borderWidth: 1,
  },
  editButtonTitle: {
    color: '#4ba5fa',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sendMessageButton: {
    borderWidth: 1,
    borderColor: '#2c3e50',
    backgroundColor: 'transparent',
    borderRadius: 30,
    height: 33,
  },
  introduce: {
    minHeight: introduceMaxAndMinHight,
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: '5%',
  },
  introduce_text: {
    fontSize: 16,
  },
  storyContainer: {
    position: 'absolute',
    bottom: '3%',
    right: '7%',
  },
  stroyButton: {
    width: width / 7,
    height: width / 7,
    borderRadius: width / 7,
    backgroundColor: '#4ba5fa',
  },
  postProcess: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    marginBottom: 5,
  },
  dummy: {
    height: width / 3,
  },
});

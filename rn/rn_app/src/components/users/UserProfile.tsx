import React from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import {Posts} from '../posts/Posts';
import {basicStyles} from '../../constants/styles';
import {ScrollView} from 'react-native-gesture-handler';
import {Post} from '../../redux/post';
import {Flash} from '../../redux/flashes';
import {flashesGradation} from '../../constants/lineGradation';
import {UserAvatar} from '../utils/Avatar';

export type FlashUserInfo = {
  userId: number;
  userName: string;
  userImage: string | null;
};

type Props = {
  user: {
    id: number;
    name: string;
    image: string | null;
    introduce: string | null;
  };
  referenceId: number;
  posts: Post[];
  flashes: Flash[];
  creatingFlash?: boolean;
  navigateToPost: (post: Post) => void;
  navigateToUserEdit?: () => void;
  navigateToChatRoom?: () => Promise<void> | void;
  navigateToTakeFlash?: () => void;
  navigateToShowFlash: ({userId, userName, userImage}: FlashUserInfo) => void;
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
    navigateToShowFlash,
  }: Props) => {
    return (
      <>
        <ScrollView style={styles.container}>
          <View style={styles.image}>
            {flashes.length || creatingFlash ? (
              <LinearGradient
                colors={flashesGradation.colors}
                start={flashesGradation.start}
                end={flashesGradation.end}
                style={styles.imageGradation}>
                <UserAvatar
                  image={user.image}
                  size="large"
                  opacity={1}
                  onPress={() => {
                    navigateToShowFlash({
                      userId: user.id,
                      userName: user.name,
                      userImage: user.image,
                    });
                  }}
                />
              </LinearGradient>
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
                    size={17}
                    color="#2c3e50"
                    style={{marginRight: 8}}
                  />
                }
                titleStyle={{...styles.editButtonTitle, color: '#2c3e50'}}
                buttonStyle={styles.editButton}
                onPress={navigateToChatRoom}
              />
            )}
          </View>
          <View style={styles.introduce}>
            {!!user.introduce && (
              <Text style={{color: basicStyles.mainTextColor}}>
                {user.introduce}
              </Text>
            )}
          </View>
          <Posts posts={posts} navigateToShowPost={navigateToPost} />
        </ScrollView>
        {referenceId === user.id && (
          <Button
            icon={<MIcon name="flash-on" size={27} style={{color: 'white'}} />}
            containerStyle={styles.storyContainer}
            buttonStyle={styles.stroyButton}
            onPress={navigateToTakeFlash}
          />
        )}
      </>
    );
  },
);

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageGradation: {
    height: 80,
    width: 80,
    borderRadius: 80,
    ...flashesGradation.baseStyle,
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10%',
  },
  nameContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '5%',
  },
  name: {
    fontSize: 19,
    marginTop: 10,
    color: basicStyles.mainTextColor,
  },
  edit: {
    alignItems: 'center',
    marginTop: '5%',
    height: 40,
  },
  editButton: {
    backgroundColor: 'transparent',
  },
  editButtonTitle: {
    color: basicStyles.skyBlueButtonColor,
    fontWeight: 'bold',
    fontSize: 16,
  },
  introduce: {
    minHeight: height / 5,
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
    backgroundColor: '#1f6fff',
    opacity: 0.9,
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

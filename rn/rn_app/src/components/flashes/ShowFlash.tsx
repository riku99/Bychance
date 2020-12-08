import React, {useCallback, useMemo, useRef, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  Dimensions,
  Image,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Button, ListItem, Icon} from 'react-native-elements';
import Video from 'react-native-video';
import {Modalize} from 'react-native-modalize';

import {X_HEIGHT} from '../../constants/device';
import {FlashUserInfo} from '../../components/users/UserProfile';
import {UserAvatar} from '../utils/Avatar';
import {Flash} from '../../redux/flashes';

type Props = {
  userInfo: FlashUserInfo;
  flashes: Flash[];
  firstRender: React.MutableRefObject<boolean>;
  deleteFlash: ({flashId}: {flashId: number}) => void;
  navigateToGoback: () => void;
};

export const ShowFlash = React.memo(
  ({userInfo, flashes, firstRender, deleteFlash, navigateToGoback}: Props) => {
    const progressWidth = useMemo(() => {
      return MAX_PROGRESS_BAR / flashes.length - 1;
    }, [flashes.length]);

    const modalList = useMemo(() => {
      return [
        {
          title: '削除',
          icon: 'delete-outline',
          titleStyle: {fontSize: 18, color: '#f74a4a'},
          onPress: ({flashId}: {flashId: number}) => {
            deleteFlash({flashId});
          },
        },
      ];
    }, [deleteFlash]);

    const [currentFlash, setCurrentFlash] = useState(flashes[0]);
    const [onLoading, setOnLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [visbleModal, setVisbleModal] = useState(false);
    const [videoRepeat, setVideoRepeat] = useState(false);

    const progressAnim = useRef<{[key: number]: Animated.Value}>({}).current;
    const progressValue = useRef(-progressWidth);
    const currentProgress = useRef(0);
    const longPress = useRef(false);
    const videoDuration = useRef<number | undefined>(undefined);
    const canStartVideo = useRef(true);
    const modalizeRef = useRef<Modalize>(null);

    const progressAnimation = useCallback(
      ({
        progressNumber,
        duration = 5000,
        restart = false,
      }: {
        progressNumber: number;
        duration?: number;
        restart?: boolean;
      }) => {
        if (progressNumber < flashes.length) {
          progressAnim[progressNumber].addListener((e) => {
            progressValue.current = e.value;
          });
          if (!restart) {
            progressValue.current = -progressWidth;
          }
          Animated.timing(progressAnim[progressNumber], {
            toValue: 0,
            duration: -progressValue.current / (progressWidth / duration),
            useNativeDriver: true,
          }).start((e) => {
            if (!canStartVideo) {
              videoDuration.current = undefined;
            }
            if (e.finished) {
              if (currentProgress.current === flashes.length - 1) {
                return;
              }
              currentProgress.current += 1;
              setCurrentFlash(flashes[currentProgress.current]);
            }
          });
        }
      },
      [progressAnim, progressWidth, flashes],
    );

    const getTimeDiff = useCallback((timestamp: string) => {
      const now = new Date();
      const createdAt = new Date(timestamp);
      const diff = now.getTime() - createdAt.getTime();
      return Math.floor(diff / (1000 * 60 * 60));
    }, []);

    useEffect(() => {
      if (visbleModal) {
        modalizeRef.current?.open();
      }
    }, [visbleModal]);

    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        delayLongPress={200}
        onPress={(e) => {
          if (e.nativeEvent.locationX > width / 2) {
            progressAnim[currentProgress.current].setValue(0);
            if (currentProgress.current < flashes.length - 1) {
              currentProgress.current += 1;
              setCurrentFlash(flashes[currentProgress.current]);
              videoDuration.current = undefined;
            }
          } else {
            if (-progressValue.current > progressWidth - progressWidth / 7) {
              canStartVideo.current = true;
              progressAnim[currentProgress.current].setValue(-progressWidth);
              if (currentProgress.current > 0) {
                currentProgress.current -= 1;
                progressAnim[currentProgress.current].setValue(-progressWidth);
                setCurrentFlash(flashes[currentProgress.current]);
              } else {
                progressAnimation({
                  progressNumber: currentProgress.current,
                  duration: videoDuration.current
                    ? videoDuration.current
                    : undefined,
                });
              }
              videoDuration.current = undefined;
            } else {
              progressAnim[currentProgress.current].setValue(-progressWidth);
              if (currentFlash.contentType === 'image') {
                progressAnimation({
                  progressNumber: currentProgress.current,
                  duration: videoDuration.current
                    ? videoDuration.current
                    : undefined,
                });
              } else {
                setVideoRepeat(true);
              }
            }
          }
        }}
        onLongPress={() => {
          progressAnim[currentProgress.current].stopAnimation();
          if (canStartVideo) {
            setIsPaused(true);
          }
          longPress.current = true;
        }}
        onPressOut={() => {
          if (longPress.current) {
            progressAnimation({
              progressNumber: currentProgress.current,
              duration: videoDuration.current,
              restart: true,
            });
            if (canStartVideo) {
              setIsPaused(false);
            }
            longPress.current = false;
          }
        }}>
        <StatusBar hidden={true} />
        {currentFlash.contentType === 'image' ? (
          <View style={styles.soruceContainer}>
            <Image
              source={{uri: currentFlash.content}}
              style={{width: '100%', height: '100%'}}
              onLoadStart={() => {
                setOnLoading(true);
                videoDuration.current = undefined;
              }}
              onLoad={() => {
                setOnLoading(false);
                progressAnimation({progressNumber: currentProgress.current});
              }}
            />
          </View>
        ) : (
          <View style={styles.soruceContainer}>
            <Video
              source={{uri: currentFlash.content}}
              style={{width: '100%', height: '100%'}}
              resizeMode="cover"
              paused={isPaused}
              repeat={videoRepeat}
              onLoadStart={() => {
                setOnLoading(true);
              }}
              onLoad={(e) => {
                videoDuration.current = e.duration * 1000;
              }}
              onProgress={({currentTime}) => {
                setOnLoading(false);
                if (currentTime > 0.002 && canStartVideo.current) {
                  progressAnimation({
                    progressNumber: currentProgress.current,
                    duration: videoDuration.current,
                  });
                  canStartVideo.current = false;
                }
              }}
              onEnd={() => {
                canStartVideo.current = true;
              }}
            />
          </View>
        )}

        <View style={styles.info}>
          <View style={styles.progressBarConteiner}>
            {flashes.map((f, i) => {
              if (!firstRender.current) {
                progressAnim[i] = new Animated.Value(-progressWidth);
              }
              return (
                <View
                  key={i}
                  style={{
                    ...styles.progressBar,
                    width: progressWidth,
                  }}>
                  <Animated.View
                    style={{
                      ...styles.animatedProgressBar,
                      width: progressWidth,
                      transform: [{translateX: progressAnim[i]}],
                    }}
                  />
                </View>
              );
            })}
          </View>
          <View style={styles.infoItems}>
            <View style={styles.userInfo}>
              <UserAvatar image={userInfo.userImage} size="small" opacity={1} />
              <Text style={styles.userName}>{userInfo.userName}</Text>
              <Text style={styles.timestamp}>
                {getTimeDiff(flashes[currentProgress.current].timestamp) < 24
                  ? getTimeDiff(
                      flashes[currentProgress.current].timestamp,
                    ).toString() + '時間前'
                  : '1日前'}
              </Text>
            </View>
            <Button
              icon={{name: 'close', color: 'white'}}
              buttonStyle={{backgroundColor: 'transparent'}}
              onPress={navigateToGoback}
            />
          </View>
        </View>
        <Button
          title="..."
          titleStyle={{fontSize: 30}}
          containerStyle={{position: 'absolute', bottom: '4%', right: 30}}
          buttonStyle={{backgroundColor: 'transparent'}}
          onPress={() => {
            setVisbleModal(true);
          }}
        />
        {onLoading && (
          <ActivityIndicator size="large" style={styles.indicator} />
        )}
        {visbleModal && (
          <Modalize
            ref={modalizeRef}
            modalHeight={140}
            onClose={() => {
              setVisbleModal(false);
            }}>
            <View style={styles.modalListContainer}>
              {modalList.map((item, i) => {
                return (
                  <ListItem
                    key={i}
                    style={{marginTop: 10}}
                    onPress={() => {
                      if (item.title === '削除') {
                        item.onPress({flashId: currentFlash.id});
                      }
                    }}>
                    {item.icon && (
                      <Icon name={item.icon} color={item.titleStyle.color} />
                    )}
                    <ListItem.Content>
                      <ListItem.Title style={item.titleStyle}>
                        {item.title}
                      </ListItem.Title>
                    </ListItem.Content>
                  </ListItem>
                );
              })}
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => {
                  setVisbleModal(false);
                }}>
                <Text style={{fontSize: 18, color: '#575757'}}>キャンセル</Text>
              </TouchableOpacity>
            </View>
          </Modalize>
        )}
      </TouchableOpacity>
    );
  },
);

const {height, width} = Dimensions.get('window');

const MAX_PROGRESS_BAR = width - 20;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  info: {
    width: '95%',
    height: 65,
    position: 'absolute',
    top: height > X_HEIGHT ? 37 : 5,
    alignSelf: 'center',
  },
  progressBarConteiner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressBar: {
    width: MAX_PROGRESS_BAR,
    height: 3,
    marginTop: 8,
    borderRadius: 5,
    backgroundColor: '#bdbdbd',
    overflow: 'hidden',
  },
  animatedProgressBar: {
    height: 3,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  infoItems: {
    width: '100%',
    height: 45,
    marginTop: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    height: 45,
    marginTop: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    marginLeft: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  timestamp: {
    marginLeft: 10,
    color: 'white',
  },
  soruceContainer: {
    backgroundColor: '#1f1f1f',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalListContainer: {
    width: '97%',
    alignSelf: 'center',
  },
  modalCancel: {
    width: '60%',
    height: 25,
    marginTop: 15,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

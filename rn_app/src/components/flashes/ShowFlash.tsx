import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Button, ListItem, Icon} from 'react-native-elements';
import Video from 'react-native-video';
import {Modalize} from 'react-native-modalize';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {UserAvatar} from '../utils/Avatar';
import {Flash} from '../../redux/flashes';
import {Post} from '../../redux/post';
import {FlashStackParamList} from '../../screens/Flash';
import {RootState, AppDispatch} from '../../redux/index';
import {
  deleteFlashThunk,
  createAlreadyViewdFlashThunk,
} from '../../actions/flashes';
import {displayShortMessage} from '../../helpers/shortMessage';
import {alertSomeError} from '../../helpers/error';

type FlashStackNavigationProp = StackNavigationProp<
  FlashStackParamList,
  'showFlashes'
>;

export type FlashesData = {
  entities: Flash[];
  alreadyViewed: number[];
  isAllAlreadyViewed?: boolean;
};

export type FlashesDataAndUser = {
  flashesData: FlashesData;
  user: {
    id: number;
    name: string;
    introduce: string;
    image: string | null;
    message: string;
    posts: Post[];
  };
};

export type FlashesWithUser = {
  flashes: {
    entities: Flash[];
    alreadyViewed: number[];
    isAllAlreadyViewed?: boolean;
  };
  user: {
    id: number;
    name: string;
    introduce: string;
    image: string | null;
    message: string;
    posts: Post[];
  };
};

type Props = {
  flashData: FlashesWithUser;
  isDisplayed: boolean;
  scrollToNextOrBackScreen: () => void;
  goBackScreen: () => void;
};

export const ShowFlash = React.memo(
  ({flashData, isDisplayed, scrollToNextOrBackScreen, goBackScreen}: Props) => {
    const entityLength = useMemo(() => flashData.flashes.entities.length, [
      flashData.flashes.entities.length,
    ]);

    const progressWidth = useMemo(() => {
      return MAX_PROGRESS_BAR / entityLength;
    }, [entityLength]);

    const alreadyViewedLength = useMemo(
      () => flashData.flashes.alreadyViewed.length,
      [flashData.flashes.alreadyViewed.length],
    );

    const [currentFlash, setCurrentFlash] = useState(() => {
      if (alreadyViewedLength && alreadyViewedLength !== entityLength) {
        return flashData.flashes.entities[alreadyViewedLength];
      } else {
        return flashData.flashes.entities[0];
      }
    });
    const [onLoading, setOnLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [visibleModal, setvisibleModal] = useState(false);
    const [isNavigatedToPofile, setIsNavigatedToProfile] = useState(false);

    const progressAnim = useRef<{[key: number]: Animated.Value}>({}).current;
    const progressValue = useRef(-progressWidth);
    const currentProgressBar = useRef(
      alreadyViewedLength && alreadyViewedLength !== entityLength
        ? alreadyViewedLength
        : 0,
    );
    const finishFirstRender = useRef(false);
    const longPress = useRef(false);
    const videoDuration = useRef<number | undefined>(undefined);
    const canStartVideo = useRef(true);
    const videoRef = useRef<Video>(null);
    const flashesLength = useRef(entityLength);
    const modalizeRef = useRef<Modalize>(null);

    const referenceId = useSelector((state: RootState) => {
      return state.userReducer.user!.id;
    });

    const creatingFlash = useSelector((state: RootState) => {
      return state.otherSettingsReducer.creatingFlash;
    });

    const flashStackNavigation = useNavigation<FlashStackNavigationProp>();

    const dispatch: AppDispatch = useDispatch();

    const createAlreadyViewdFlash = useCallback(
      async ({flashId}: {flashId: number}) => {
        await dispatch(createAlreadyViewdFlashThunk({flashId}));
      },
      [dispatch],
    );

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
        if (progressNumber < entityLength) {
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
            createAlreadyViewdFlash({flashId: currentFlash.id});
            // アニメーションが終了した、つまりタップによるスキップなく最後まで完了した場合
            if (e.finished) {
              // 進行してたプログレスバーがラストだった場合
              if (currentProgressBar.current === entityLength - 1) {
                scrollToNextOrBackScreen();
                return;
              }
              canStartVideo.current = true;
              currentProgressBar.current += 1;
              setCurrentFlash(
                flashData.flashes.entities[currentProgressBar.current],
              );
            }
          });
        }
      },
      [
        createAlreadyViewdFlash,
        currentFlash.id,
        entityLength,
        flashData.flashes.entities,
        progressAnim,
        progressWidth,
        scrollToNextOrBackScreen,
      ],
    );

    const getTimeDiff = useCallback((timestamp: string) => {
      const now = new Date();
      const createdAt = new Date(timestamp);
      const diff = now.getTime() - createdAt.getTime();
      return Math.floor(diff / (1000 * 60 * 60));
    }, []);

    const navigateToProfile = useCallback(() => {
      flashStackNavigation.push('AnotherUserProfileFromFlash', {
        ...flashData.user,
        flashes: flashData.flashes,
      });
      setIsNavigatedToProfile(true);
    }, [flashData, flashStackNavigation]);

    const deleteFlash = useCallback(
      async ({flashId}: {flashId: number}) => {
        Alert.alert('本当に削除してもよろしいですか?', '', [
          {
            text: 'はい',
            onPress: async () => {
              const result = await dispatch(deleteFlashThunk({flashId}));
              if (deleteFlashThunk.fulfilled.match(result)) {
                displayShortMessage('削除しました', 'success');
                modalizeRef.current?.close();
              } else {
                if (
                  result.payload &&
                  result.payload.errorType === 'invalidError'
                ) {
                  displayShortMessage(result.payload.message, 'danger');
                } else if (
                  result.payload &&
                  result.payload.errorType === 'someError'
                ) {
                  alertSomeError();
                }
              }
            },
          },
          {
            text: 'いいえ',
            onPress: () => {
              return;
            },
          },
        ]);
      },
      [dispatch],
    );

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

    useEffect(() => {
      finishFirstRender.current = true;
    }, []);

    // アイテムが追加、削除された時の責務を定義
    useEffect(() => {
      // アイテムが削除された場合
      if (entityLength < flashesLength.current) {
        setCurrentFlash(flashData.flashes.entities[currentProgressBar.current]);
      }
      flashesLength.current = entityLength;
    }, [entityLength, flashData.flashes]);

    // このコンポーネントが表示された、表示されている時の責務を定義
    useEffect(() => {
      if (isDisplayed) {
        if (currentFlash.contentType === 'video') {
          setIsPaused(false);
        }
      }
    }, [currentFlash, isDisplayed]);

    // このコンポーネントがスクリーンにおさまった、おさまっている時の責務を定義
    useEffect(() => {
      if (!isDisplayed) {
        progressAnim[currentProgressBar.current].stopAnimation();
        progressAnim[currentProgressBar.current].setValue(-progressWidth);
        if (currentFlash.contentType === 'video') {
          videoRef.current!.seek(0);
        }
        canStartVideo.current = true;
      }
    }, [isDisplayed, progressAnim, progressWidth, currentFlash.contentType]);

    // profileに移動した時の責務
    useEffect(() => {
      if (isNavigatedToPofile) {
        progressAnim[currentProgressBar.current].stopAnimation();
        progressAnim[currentProgressBar.current].setValue(-progressWidth);
        if (currentFlash.contentType === 'video') {
          videoRef.current!.seek(0);
        }
      }
    }, [
      isNavigatedToPofile,
      progressAnim,
      currentProgressBar,
      progressWidth,
      currentFlash.contentType,
    ]);

    // profileから戻ってきた時のリスナー
    useEffect(() => {
      const unsbscribe = flashStackNavigation.addListener('focus', () => {
        if (isNavigatedToPofile) {
          setIsPaused(false);
          progressAnimation({
            progressNumber: currentProgressBar.current,
            duration: videoDuration.current,
          });
          setIsNavigatedToProfile(false);
        }
      });

      return unsbscribe;
    }, [flashStackNavigation, isNavigatedToPofile, progressAnimation]);

    return (
      <>
        <View style={styles.container}>
          {entityLength ? (
            <TouchableOpacity
              activeOpacity={1}
              delayLongPress={200}
              disabled={visibleModal}
              onPress={(e) => {
                // 画面右半分をプレスした、つまりアイテムをスキップした場合
                if (e.nativeEvent.locationX > width / 2) {
                  progressAnim[currentProgressBar.current].setValue(0);
                  if (currentProgressBar.current < entityLength - 1) {
                    currentProgressBar.current += 1;
                    setCurrentFlash(
                      flashData.flashes.entities[currentProgressBar.current],
                    );
                    videoDuration.current = undefined;
                    canStartVideo.current = true;
                  } else {
                    scrollToNextOrBackScreen();
                  }
                  // 画面左半分をプレスした場合
                } else {
                  // プログレスバーの進行状況が1/7未満の場合
                  if (
                    -progressValue.current >
                    progressWidth - progressWidth / 7
                  ) {
                    canStartVideo.current = true;
                    progressAnim[currentProgressBar.current].setValue(
                      -progressWidth,
                    );
                    // 進行しているプログレスバーが2個目以上の場合
                    if (currentProgressBar.current > 0) {
                      currentProgressBar.current -= 1;
                      progressAnim[currentProgressBar.current].setValue(
                        -progressWidth,
                      );
                      videoDuration.current = undefined;
                      setCurrentFlash(
                        flashData.flashes.entities[currentProgressBar.current],
                      );
                    } else {
                      if (!onLoading) {
                        progressAnimation({
                          progressNumber: currentProgressBar.current,
                          duration: videoDuration.current
                            ? videoDuration.current
                            : undefined,
                        });
                      }
                      if (videoRef.current) {
                        videoRef.current.seek(0);
                      }
                    }
                  } else {
                    if (!onLoading) {
                      progressAnim[currentProgressBar.current].setValue(
                        -progressWidth,
                      );
                      if (currentFlash.contentType === 'image') {
                        progressAnimation({
                          progressNumber: currentProgressBar.current,
                          duration: videoDuration.current
                            ? videoDuration.current
                            : undefined,
                        });
                      } else {
                        if (videoRef.current) {
                          progressAnimation({
                            progressNumber: currentProgressBar.current,
                            duration: videoDuration.current,
                          });
                          videoRef.current.seek(0);
                        }
                      }
                    }
                  }
                }
              }}
              onLongPress={() => {
                progressAnim[currentProgressBar.current].stopAnimation();
                if (canStartVideo) {
                  setIsPaused(true);
                }
                longPress.current = true;
              }}
              onPressOut={() => {
                if (longPress.current) {
                  progressAnimation({
                    progressNumber: currentProgressBar.current,
                    duration: videoDuration.current,
                    restart: true,
                  });
                  if (canStartVideo) {
                    setIsPaused(false);
                  }
                  longPress.current = false;
                }
              }}>
              {currentFlash.contentType === 'image' ? (
                <View style={styles.soruceContainer}>
                  {isDisplayed ? (
                    <Image
                      source={{
                        uri: currentFlash.content,
                      }}
                      style={{width: '100%', height: '100%'}}
                      onLoadStart={() => {
                        setOnLoading(true);
                        videoDuration.current = undefined;
                      }}
                      onLoad={() => {
                        setOnLoading(false);
                        progressAnimation({
                          progressNumber: currentProgressBar.current,
                        });
                      }}
                    />
                  ) : (
                    <Image
                      source={{
                        uri: currentFlash.content + '?' + new Date(),
                      }}
                      style={{width: '100%', height: '100%'}}
                    />
                  )}
                </View>
              ) : (
                <View style={styles.soruceContainer}>
                  <Video
                    ref={videoRef}
                    source={{uri: currentFlash.content}}
                    style={{width: '100%', height: '100%'}}
                    resizeMode="cover"
                    paused={isPaused}
                    onLoadStart={() => {
                      setOnLoading(true);
                    }}
                    onLoad={(e) => {
                      if (!isDisplayed) {
                        setIsPaused(true);
                        setOnLoading(false);
                      }
                      videoDuration.current = e.duration * 1000;
                    }}
                    onProgress={({currentTime}) => {
                      setOnLoading(false);
                      if (currentTime > 0.002 && canStartVideo.current) {
                        progressAnimation({
                          progressNumber: currentProgressBar.current,
                          duration: videoDuration.current,
                        });
                        if (canStartVideo.current) {
                          canStartVideo.current = false;
                        }
                      }
                    }}
                    onSeek={() => {
                      if (!isDisplayed || isNavigatedToPofile) {
                        setIsPaused(true);
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
                  {flashData.flashes.entities.map((f, i) => {
                    // 初回レンダリングの場合
                    if (!finishFirstRender.current) {
                      if (
                        i < alreadyViewedLength &&
                        alreadyViewedLength !== entityLength
                      ) {
                        progressAnim[i] = new Animated.Value(0);
                      } else {
                        progressAnim[i] = new Animated.Value(-progressWidth);
                      }
                    }
                    // アイテムが追加された場合
                    if (entityLength > flashesLength.current) {
                      progressAnim[entityLength - 1] = new Animated.Value(
                        -progressWidth,
                      );
                    }
                    // アイテムが削除された場合
                    if (entityLength < flashesLength.current) {
                      // 削除されたアイテムが最後のものだった場合
                      if (currentProgressBar.current === entityLength) {
                        currentProgressBar.current -= 1;
                      }
                      // この要素(f)が削除されたアイテムよりも後にある場合
                      if (i >= currentProgressBar.current) {
                        progressAnim[i] = new Animated.Value(-progressWidth);
                      }
                    }
                    return (
                      <View
                        key={f.id}
                        style={{
                          ...styles.progressBar,
                          width: progressWidth,
                        }}>
                        <Animated.View
                          style={{
                            ...styles.animatedProgressBar,
                            width: progressWidth,
                            transform: [
                              {
                                translateX: progressAnim[i],
                              },
                            ],
                          }}
                        />
                      </View>
                    );
                  })}
                </View>
                <View style={styles.infoItems}>
                  <TouchableOpacity
                    style={styles.userInfo}
                    onPress={navigateToProfile}>
                    <UserAvatar
                      image={flashData.user.image}
                      size="small"
                      opacity={1}
                    />
                    <Text style={styles.userName}>{flashData.user.name}</Text>
                    <Text style={styles.timestamp}>
                      {getTimeDiff(
                        flashData.flashes.entities[currentProgressBar.current]
                          .timestamp,
                      ) < 24
                        ? getTimeDiff(
                            flashData.flashes.entities[
                              currentProgressBar.current
                            ].timestamp,
                          ).toString() + '時間前'
                        : '1日前'}
                    </Text>
                  </TouchableOpacity>
                  <Button
                    icon={{name: 'close', color: 'white'}}
                    buttonStyle={{backgroundColor: 'transparent'}}
                    onPress={goBackScreen}
                  />
                </View>
                {creatingFlash && referenceId === flashData.user.id && (
                  <View style={styles.addMessageContainer}>
                    <ActivityIndicator color="white" />
                    <Text style={styles.addMessage}>新しく追加しています</Text>
                  </View>
                )}
              </View>
              {flashData.user.id === referenceId && (
                <Button
                  title="..."
                  titleStyle={{fontSize: 30}}
                  containerStyle={{
                    position: 'absolute',
                    bottom: '4%',
                    right: 30,
                  }}
                  buttonStyle={{backgroundColor: 'transparent'}}
                  onPress={() => {
                    modalizeRef.current?.open();
                    setvisibleModal(true);
                    setIsPaused(true);
                    progressAnim[currentProgressBar.current].stopAnimation();
                  }}
                />
              )}
              {onLoading && (
                <ActivityIndicator size="large" style={styles.indicator} />
              )}

              <Modalize
                ref={modalizeRef}
                modalHeight={140}
                onClosed={() => {
                  setIsPaused(false);
                  progressAnimation({
                    progressNumber: currentProgressBar.current,
                    duration: videoDuration ? videoDuration.current : undefined,
                    restart: true,
                  });
                  setvisibleModal(false);
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
                          <Icon
                            name={item.icon}
                            color={item.titleStyle.color}
                          />
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
                      modalizeRef.current?.close();
                      setvisibleModal(false);
                    }}>
                    <Text style={{fontSize: 18, color: '#575757'}}>
                      キャンセル
                    </Text>
                  </TouchableOpacity>
                </View>
              </Modalize>
            </TouchableOpacity>
          ) : (
            creatingFlash && (
              <View style={styles.creatingFlashContainer}>
                <View style={styles.creatingFlashMessage}>
                  <ActivityIndicator color="white" />
                  <Text style={{color: 'white'}}>追加しています</Text>
                </View>
              </View>
            )
          )}
        </View>
      </>
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
    top: 5,
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
  addMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  addMessage: {
    color: 'white',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  soruceContainer: {
    backgroundColor: '#1f1f1f',
  },
  indicator: {
    width: 40,
    height: 40,
    position: 'absolute',
    top: height / 2,
    left: width / 2,
    transform: [{translateX: -20}, {translateY: -20}],
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
  creatingFlashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#1f1f1f',
  },
  creatingFlashMessage: {
    width: 160,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});

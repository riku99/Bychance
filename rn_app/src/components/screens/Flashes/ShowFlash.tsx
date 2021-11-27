import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
  GestureResponderEvent,
} from 'react-native';
import Video, {OnLoadData} from 'react-native-video';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {Button} from 'react-native-elements';

import {ProgressBar} from './ProgressBar';
import {InfoItems} from './InfoItems';
import {Modal} from './Modal';
import {FlashStackNavigationProp} from '../../../navigations/types';
import {useMyId} from '~/hooks/users';
import {WideRangeSourceContainer} from '~/components/utils/WideRangeSourceContainer';
import {VideoWithThumbnail} from '~/components/utils/VideowithThumbnail';
import {Stamps} from './Stamps';
import {useViewed} from '~/hooks/flashes';
import {usePauseFlashPregress} from '~/hooks/appState';
import {usePrefetchStamps} from '~/hooks/flashStamps';

type Props = {
  flashes: {
    id: number;
    source: string;
    sourceType: 'image' | 'video';
    createdAt: string;
    viewed: {userId: string}[];
    viewerViewed?: boolean;
  }[];
  user: {
    id: string;
  };
  isDisplayed: boolean;
  scrolling: boolean;
  scrollToNextOrBackScreen: () => void;
};

export const ShowFlash = React.memo(
  ({
    flashes,
    user,
    isDisplayed,
    scrolling,
    scrollToNextOrBackScreen,
  }: Props) => {
    const myId = useMyId();

    const isMyData = myId === user.id;
    const entityLength = flashes.length;
    const progressBarWidth = MAX_PROGRESS_BAR / entityLength;

    const alreadyViewedIds = flashes
      .filter((f) => f.viewerViewed)
      .map((f) => f.id);
    const alreadyViewedLength = alreadyViewedIds.length;

    // 実際に表示されているentity
    // このコンポーネントがFlatListにより表示されて最初のレンダリングの際、既に見たものがある場合それを飛ばしている
    // ただ、まだ何も見ていない、または全て見ている(alreadyViewedLengthとentityの数が同じ)場合は最初のものを指定
    const [currentFlash, setCurrentFlash] = useState(() => {
      if (alreadyViewedLength && alreadyViewedLength !== entityLength) {
        return flashes[alreadyViewedLength];
      } else {
        return flashes[0];
      }
    });

    const [loading, setLoading] = useState(true); // ソースが実際にロード中なのかどうかを表す
    const [showLoading, setShowLoading] = useState(false); // インディケーターを出すか否かを表す
    const _loading = useRef(true); // setTimeout内でロードしている場合はshowLoadをtureにする、という処理が存在する。その中でloadingを使い条件分岐を行うとsetLoadingが非同期で値を変えるため期待しない動きになってしまう。同期的に値を変えることを可能にするためにuseRefのデータを定義
    const loadingTimeout = useRef<ReturnType<typeof setTimeout>>(); // timeoutをクリアするためこいつにいれる

    const {pauseFlashProgress, setPauseFlashProgress} = usePauseFlashPregress();
    const [isPaused, setIsPaused] = useState(false);

    const progressAnim = useRef<{[key: number]: Animated.Value}>({}).current;
    const progressValue = useRef(-progressBarWidth);
    const currentProgressBar = useRef(
      alreadyViewedLength && alreadyViewedLength !== entityLength
        ? alreadyViewedLength
        : 0,
    );

    const nextItem = useRef(flashes[currentProgressBar.current + 1]);

    const longPress = useRef(false);
    const videoDuration = useRef<number | undefined>(undefined);
    const videoRef = useRef<Video>(null);
    const firstEntitiesLength = useRef(entityLength);

    const [modalVisible, setModalVisible] = useState(false);

    const flashStackNavigation = useNavigation<
      FlashStackNavigationProp<'Flashes'>
    >();

    const {createViewed} = useViewed();

    const onViewed = useCallback(
      async ({flashId}: {flashId: number}) => {
        const existing = alreadyViewedIds.includes(flashId);
        if (!existing && !isMyData) {
          createViewed({
            flashId,
            userIds: [{userId: user.id}, ...currentFlash.viewed],
          });
        }
      },
      [alreadyViewedIds, isMyData, currentFlash.viewed, user.id, createViewed],
    );

    // プログレスバーのアニメーション
    const progressAnimation = useCallback(
      ({
        progressNumber,
        duration = 4000,
        restart = false,
      }: {
        progressNumber: number;
        duration?: number;
        restart?: boolean;
      }) => {
        if (progressNumber < entityLength && isDisplayed) {
          progressAnim[progressNumber].addListener((e) => {
            progressValue.current = e.value;
          });
          if (!restart) {
            progressValue.current = -progressBarWidth;
          }
          Animated.timing(progressAnim[progressNumber], {
            toValue: 0,
            duration: -progressValue.current / (progressBarWidth / duration),
            useNativeDriver: true,
          }).start((e) => {
            onViewed({flashId: currentFlash.id});
            // アニメーションが終了した、つまりタップによるスキップなく最後まで完了した場合
            if (e.finished) {
              // 進行してたプログレスバーがラストだった場合
              if (currentProgressBar.current === entityLength - 1) {
                scrollToNextOrBackScreen();
                return;
              }
              currentProgressBar.current += 1;
              setCurrentFlash(flashes[currentProgressBar.current]);
            }
          });
        }
      },
      [
        flashes,
        onViewed,
        currentFlash.id,
        entityLength,
        progressAnim,
        progressBarWidth,
        scrollToNextOrBackScreen,
        isDisplayed,
      ],
    );

    // アイテムが追加、削除された時の責務を定義
    useEffect(() => {
      // アイテムが削除された場合
      if (entityLength < firstEntitiesLength.current) {
        setCurrentFlash(flashes[currentProgressBar.current]);
      }
      firstEntitiesLength.current = entityLength;
    }, [entityLength, flashes]);

    // このコンポーネントが表示された、表示されている時の責務を定義
    useEffect(() => {
      if (isDisplayed) {
        if (currentFlash.sourceType === 'video') {
          setIsPaused(false);
        }
      }
    }, [currentFlash, isDisplayed]);

    // このコンポーネントがスクリーンから外れた場合の責務
    useEffect(() => {
      if (!isDisplayed) {
        progressAnim[currentProgressBar.current].stopAnimation();
        progressAnim[currentProgressBar.current].setValue(-progressBarWidth);
        if (currentFlash.sourceType === 'video') {
          videoRef.current!.seek(0);
        }
      }
    }, [isDisplayed, progressAnim, progressBarWidth, currentFlash.sourceType]);

    //pauseFlashProgressがいじられた時
    useEffect(() => {
      if (pauseFlashProgress) {
        progressAnim[currentProgressBar.current].stopAnimation();
        progressAnim[currentProgressBar.current].setValue(-progressBarWidth);
        if (currentFlash.sourceType === 'video') {
          videoRef.current!.seek(0);
          setIsPaused(true); // いらないかも
        }
      }
    }, [
      pauseFlashProgress,
      progressAnim,
      currentProgressBar,
      progressBarWidth,
      currentFlash.sourceType,
      progressAnimation,
    ]);

    // focus時のリスナー
    useEffect(() => {
      const unsbscribe = flashStackNavigation.addListener('focus', () => {
        if (pauseFlashProgress) {
          setPauseFlashProgress(false);
          setIsPaused(false);
          progressAnimation({
            progressNumber: currentProgressBar.current,
            duration: videoDuration.current,
          });
        }
      });

      return unsbscribe;
    }, [
      setPauseFlashProgress,
      pauseFlashProgress,
      flashStackNavigation,
      progressAnimation,
    ]);

    const scrollRef = useRef(false);

    //スクロールした時の処理;
    useEffect(() => {
      if (scrolling) {
        progressAnim[currentProgressBar.current].stopAnimation();
        if (currentFlash.sourceType === 'video') {
          setIsPaused(true);
        }
        scrollRef.current = true;
      } else if (scrollRef.current && isDisplayed) {
        progressAnimation({
          progressNumber: currentProgressBar.current,
          duration: videoDuration.current,
          restart: true,
        });
        if (currentFlash.sourceType === 'video') {
          setIsPaused(false);
        }
        scrollRef.current = false;
      }
    }, [
      scrolling,
      currentFlash.sourceType,
      progressAnim,
      progressAnimation,
      isDisplayed,
      showLoading,
    ]);

    const onScreenPres = (e: GestureResponderEvent) => {
      // 画面右半分をプレスした、つまりアイテムをスキップした場合
      if (e.nativeEvent.locationX > width / 2) {
        progressAnim[currentProgressBar.current].setValue(0);
        if (currentProgressBar.current < entityLength - 1) {
          currentProgressBar.current += 1;
          setCurrentFlash(flashes[currentProgressBar.current]);
          videoDuration.current = undefined;
        } else {
          scrollToNextOrBackScreen();
        }
        // 画面左半分をプレスした場合
      } else {
        // プログレスバーの進行状況が1/7未満の場合
        if (-progressValue.current > progressBarWidth - progressBarWidth / 7) {
          progressAnim[currentProgressBar.current].setValue(-progressBarWidth);
          // 進行しているプログレスバーが2個目以上の場合
          if (currentProgressBar.current > 0) {
            currentProgressBar.current -= 1;
            progressAnim[currentProgressBar.current].setValue(
              -progressBarWidth,
            );
            videoDuration.current = undefined;
            setCurrentFlash(flashes[currentProgressBar.current]);
          } else {
            if (!loading) {
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
          // 現在のプログレスバーのアニメーションが1/7以上の場合。そのプログレスバーのアニメーションを初めから実行させる
        } else {
          if (!showLoading) {
            // まずアニメーションの値を初期値に戻す。(プログレスバーが白くなってない状態)
            progressAnim[currentProgressBar.current].setValue(
              -progressBarWidth,
            );
            if (currentFlash.sourceType === 'image') {
              progressAnimation({
                progressNumber: currentProgressBar.current,
                duration: undefined,
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
    };

    const onScreenLongPress = () => {
      if (!loading) {
        progressAnim[currentProgressBar.current].stopAnimation();
        if (currentFlash.sourceType === 'video') {
          setIsPaused(true);
        }
        longPress.current = true;
      }
    };

    const onScreenPressOut = () => {
      if (longPress.current && !loading) {
        progressAnimation({
          progressNumber: currentProgressBar.current,
          duration: videoDuration.current,
          restart: true,
        });
        if (currentFlash.sourceType === 'video') {
          setIsPaused(false);
        }
        longPress.current = false;
      }
    };

    const {prefetch} = usePrefetchStamps();
    // ソースが切り替わった場合
    useEffect(() => {
      nextItem.current = flashes[currentProgressBar.current + 1];
      if (nextItem.current) {
        prefetch(nextItem.current.id);
      }
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current);
      }
      setLoading(true);
      _loading.current = true;
    }, [currentFlash.id, prefetch]); // eslint-disable-line

    const onImageLoadStart = () => {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current);
      }

      const timer = setTimeout(() => {
        if (_loading.current) {
          setShowLoading(true);
        }
      }, 1500);

      loadingTimeout.current = timer;
      videoDuration.current = undefined;
    };

    const onImageLoad = () => {
      _loading.current = false;
      setShowLoading(false);
      setLoading(false);
      if (isDisplayed) {
        progressAnimation({
          progressNumber: currentProgressBar.current,
        });
      }
    };

    const onVideoLoadStart = () => {
      if (isDisplayed) {
        if (loadingTimeout.current) {
          clearTimeout(loadingTimeout.current);
        }
        const timer = setTimeout(() => {
          if (_loading.current) {
            setShowLoading(true);
          }
        }, 1500);

        loadingTimeout.current = timer;
      }
    };

    const onVideoLoad = (e: OnLoadData) => {
      if (!isDisplayed) {
        setIsPaused(true);
        setShowLoading(false);
      }
      videoDuration.current = e.duration * 1000;
    };

    // videoとアニメーションを合わせるためにvideoが始まり次第即座にプログレスバーのアニメーションを開始させている
    // onProgressはビデオ再生中一定間隔で実行されるので、何度もアニメーションの実行が起こらないようにloadingで制御
    // onVideoLoadでロード終了のタイミングを取れるが、それが発火してから実際に動画が再生されるまでに乖離があるのでonVideoProgressでとるようにしている
    const onVideoProgress = ({currentTime}: {currentTime: number}) => {
      if (currentTime > 0.002 && loading) {
        _loading.current = false;
        setShowLoading(false);
        setLoading(false);
        progressAnimation({
          progressNumber: currentProgressBar.current,
          duration: videoDuration.current,
        });
      }
    };

    const onVideoSeek = () => {
      if (!isDisplayed) {
        setIsPaused(true);
      }
    };

    const {top} = useSafeAreaInsets();

    return (
      <View style={styles.container}>
        {!!entityLength && (
          <>
            <View style={{top}}>
              <WideRangeSourceContainer>
                <TouchableOpacity
                  activeOpacity={1}
                  delayLongPress={100}
                  onPress={(e) => onScreenPres(e)}
                  onLongPress={onScreenLongPress}
                  onPressOut={onScreenPressOut}>
                  {currentFlash.sourceType === 'image' ? (
                    <FastImage
                      source={{
                        uri: currentFlash.source,
                      }}
                      style={styles.source}
                      onLoadStart={onImageLoadStart}
                      onLoad={onImageLoad}
                    />
                  ) : (
                    <>
                      <VideoWithThumbnail
                        video={{
                          ref: videoRef,
                          source: {
                            uri: currentFlash.source,
                          },
                          paused: isPaused,
                          onLoadStart: onVideoLoadStart,
                          onLoad: (e) => onVideoLoad(e),
                          onProgress: ({currentTime}) => {
                            onVideoProgress({currentTime});
                          },
                          onSeek: onVideoSeek,
                          ignoreSilentSwitch: 'ignore',
                          resizeMode: 'contain',
                        }}
                        thumbnail={{
                          resizeMode: 'contain',
                        }}
                      />
                      {/* キャッシュ作るためにpreloadしたかったが今のところそのためのメソッドはなさそうなのでコンポーネント内で読み込む */}
                      {nextItem.current &&
                        nextItem.current.sourceType === 'video' && (
                          <Video
                            source={{uri: nextItem.current.source}}
                            style={{width: 0, height: 0}}
                          />
                        )}
                    </>
                  )}
                </TouchableOpacity>
              </WideRangeSourceContainer>
            </View>

            <View style={[styles.info, {top: top + 10}]}>
              <ProgressBar
                flashes={flashes}
                entityLength={entityLength}
                alreadyViewedLength={
                  alreadyViewedLength ? alreadyViewedLength : 0
                }
                progressAnim={progressAnim}
                progressBarWidth={progressBarWidth}
                currentProgressBar={currentProgressBar}
                firstEntitiesLength={firstEntitiesLength}
              />
              <InfoItems user={user} timestamp={currentFlash.createdAt} />
            </View>

            <View style={styles.stampsContainer}>
              <Stamps flashId={currentFlash.id} />
            </View>

            {isMyData && (
              <View style={styles.showModalButtonContainer}>
                <Button
                  icon={{name: 'more-horiz', size: 22, color: '#ffffff'}}
                  buttonStyle={{backgroundColor: 'transparent'}}
                  activeOpacity={1}
                  onPress={() => {
                    setModalVisible(true);
                    setIsPaused(true);
                    progressAnim[currentProgressBar.current].stopAnimation();
                  }}
                />
              </View>
            )}

            <View style={styles.viewsNumberContainer}>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <MIcon name="remove-red-eye" color="white" size={30} />
                <Text style={{color: 'white', fontWeight: '500'}}>
                  {currentFlash.viewed.length}
                </Text>
              </View>
            </View>

            {showLoading && (
              <ActivityIndicator size="large" style={styles.indicator} />
            )}

            <Modal
              flashId={currentFlash.id}
              isVisible={modalVisible}
              setIsVisible={setModalVisible}
              closeModal={() => {
                setModalVisible(false);
                setIsPaused(false);
                progressAnimation({
                  progressNumber: currentProgressBar.current,
                  duration: videoDuration ? videoDuration.current : undefined,
                  restart: true,
                });
              }}
            />
          </>
        )}
      </View>
    );
  },
);

const {height, width} = Dimensions.get('window');

const MAX_PROGRESS_BAR = width - 20;

const buttonBottom = height * 0.05;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  info: {
    width: '95%',
    height: 65,
    position: 'absolute',
    alignSelf: 'center',
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
    backgroundColor: 'black',
  },
  source: {
    width: '100%',
    height: '100%',
  },
  indicator: {
    width: 40,
    height: 40,
    position: 'absolute',
    top: height / 2,
    left: width / 2,
    transform: [{translateX: -20}, {translateY: -20}],
  },
  showModalButtonContainer: {
    position: 'absolute',
    bottom: buttonBottom,
    right: 30,
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
  creatingWideRangeSourceContainer: {
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
  viewsNumberContainer: {
    position: 'absolute',
    left: 30,
    bottom: buttonBottom,
    flexDirection: 'row',
  },
  stampsContainer: {
    width: '100%',
    height: 40,
    position: 'absolute',
    bottom: height * 0.13,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

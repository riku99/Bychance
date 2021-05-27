import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
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
import {useDispatch, useSelector} from 'react-redux';
import Video, {OnLoadData} from 'react-native-video';
import {Modalize} from 'react-native-modalize';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {ProgressBar} from './ProgressBar';
import {InfoItems} from './InfoItems';
import {ShowModalButton} from './ShowModalButton';
import {Modal} from './Modal';
import {FlashesData} from '~/stores/types';
import {RootState, AppDispatch} from '../../../stores/index';
import {FlashStackNavigationProp} from '../../../screens/types';
import {FlashUserData} from '../../../screens/Flashes';
import {createAlreadyViewdFlashThunk} from '../../../apis/flashes/createAlreadyViewedFlashes';
import {selectNearbyUserAlreadyViewed} from '../../../stores/nearbyUsers';
import {selectChatPartnerAlreadyViewed} from '../../../stores/chatPartners';
import {useMyId} from '../../../hooks/selector/user';
import {WideRangeSourceContainer} from '~/components/utils/WideRangeSourceContainer';
import {VideoWithThumbnail} from '~/components/utils/VideowithThumbnail';

type Props = {
  flashesData: FlashesData;
  userData: FlashUserData;
  isDisplayed: boolean;
  scrolling: boolean;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  scrollToNextOrBackScreen: () => void;
};

export const ShowFlash = React.memo(
  ({
    flashesData,
    userData,
    isDisplayed,
    scrolling,
    showModal,
    setShowModal,
    scrollToNextOrBackScreen,
  }: Props) => {
    const referenceId = useMyId();

    const entityLength = useMemo(() => flashesData.entities.length, [
      flashesData.entities,
    ]);

    const progressBarWidth = useMemo(() => {
      return MAX_PROGRESS_BAR / entityLength;
    }, [entityLength]);

    // flashesData.alreadyViewedLengthでデータは取れるが、storeの更新を即座に反映させるためにセレクタを使いstoreから取得
    const alreadyViewedLength = useSelector((state: RootState) => {
      if (userData.from && userData.userId) {
        switch (userData.from) {
          case 'nearbyUsers':
            return selectNearbyUserAlreadyViewed(state, userData.userId).length;
          case 'chatRoom':
            return selectChatPartnerAlreadyViewed(state, userData.userId)
              .length;
        }
      } else {
        0;
      }
    });

    // 実際に表示されているentity
    // このコンポーネントがFlatListにより表示されて最初のレンダリングの際、既に見たものがある場合それを飛ばしている
    // ただ、まだ何も見ていない、または全て見ている(alreadyViewedLengthとentityの数が同じ)場合は最初のものを指定
    const [currentFlash, setCurrentFlash] = useState(() => {
      if (alreadyViewedLength && alreadyViewedLength !== entityLength) {
        return flashesData.entities[alreadyViewedLength];
      } else {
        return flashesData.entities[0];
      }
    });

    const [onLoading, setOnLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [isNavigatedToPofile, setIsNavigatedToProfile] = useState(false);

    const progressAnim = useRef<{[key: number]: Animated.Value}>({}).current;
    const progressValue = useRef(-progressBarWidth);
    const currentProgressBar = useRef(
      alreadyViewedLength && alreadyViewedLength !== entityLength
        ? alreadyViewedLength
        : 0,
    );

    const longPress = useRef(false);
    const videoDuration = useRef<number | undefined>(undefined);
    const canStartVideo = useRef(true);
    const videoRef = useRef<Video>(null);
    const firstEntitiesLength = useRef(entityLength);
    const modalizeRef = useRef<Modalize>(null);

    const creatingFlash = useSelector((state: RootState) => {
      return state.otherSettingsReducer.creatingFlash;
    });

    const flashStackNavigation = useNavigation<
      FlashStackNavigationProp<'Flashes'>
    >();

    const dispatch: AppDispatch = useDispatch();

    const createAlreadyViewdFlash = useCallback(
      async ({flashId}: {flashId: number}) => {
        await dispatch(
          createAlreadyViewdFlashThunk({flashId, userId: userData.userId}),
        );
      },
      [dispatch, userData.userId],
    );

    // プログレスバーのアニメーション
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
            createAlreadyViewdFlash({flashId: currentFlash.id});
            // アニメーションが終了した、つまりタップによるスキップなく最後まで完了した場合
            if (e.finished) {
              // 進行してたプログレスバーがラストだった場合
              if (currentProgressBar.current === entityLength - 1) {
                scrollToNextOrBackScreen();
                return;
              }
              currentProgressBar.current += 1;
              setCurrentFlash(flashesData.entities[currentProgressBar.current]);
            }
          });
        }
      },
      [
        createAlreadyViewdFlash,
        currentFlash.id,
        entityLength,
        flashesData.entities,
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
        setCurrentFlash(flashesData.entities[currentProgressBar.current]);
      }
      firstEntitiesLength.current = entityLength;
    }, [entityLength, flashesData.entities]);

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

    // profileに移動した時の責務
    useEffect(() => {
      if (isNavigatedToPofile) {
        progressAnim[currentProgressBar.current].stopAnimation();
        progressAnim[currentProgressBar.current].setValue(-progressBarWidth);
        if (currentFlash.sourceType === 'video') {
          videoRef.current!.seek(0);
        }
      }
    }, [
      isNavigatedToPofile,
      progressAnim,
      currentProgressBar,
      progressBarWidth,
      currentFlash.sourceType,
    ]);

    // profileから戻ってきた時のリスナーを定義する副作用
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

    const scrollRef = useRef(false);
    // スクロールした時の処理
    useEffect(() => {
      if (scrolling) {
        progressAnim[currentProgressBar.current].stopAnimation();
        if (currentFlash.sourceType === 'video') {
          setIsPaused(true);
        }
        scrollRef.current = true;
      } else if (scrollRef.current && isDisplayed && !onLoading) {
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
      showModal,
      isDisplayed,
      onLoading,
    ]);

    const onScreenPres = (e: GestureResponderEvent) => {
      // 画面右半分をプレスした、つまりアイテムをスキップした場合
      if (e.nativeEvent.locationX > width / 2) {
        progressAnim[currentProgressBar.current].setValue(0);
        if (currentProgressBar.current < entityLength - 1) {
          currentProgressBar.current += 1;
          setCurrentFlash(flashesData.entities[currentProgressBar.current]);
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
            setCurrentFlash(flashesData.entities[currentProgressBar.current]);
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
          // 現在のプログレスバーのアニメーションが1/7以上の場合。そのプログレスバーのアニメーションを初めから実行させる
        } else {
          if (!onLoading) {
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
      progressAnim[currentProgressBar.current].stopAnimation();
      if (currentFlash.sourceType === 'video') {
        setIsPaused(true);
      }
      longPress.current = true;
    };

    const onScreenPressOut = () => {
      if (longPress.current) {
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

    const onImageLoadStart = () => {
      setOnLoading(true);
      videoDuration.current = undefined;
    };

    const onImageLoad = () => {
      setOnLoading(false);
      progressAnimation({
        progressNumber: currentProgressBar.current,
      });
    };

    const onVideoLoadStart = () => {
      setOnLoading(true);
      canStartVideo.current = true;
    };

    const onVideoLoad = (e: OnLoadData) => {
      if (!isDisplayed) {
        setIsPaused(true);
        setOnLoading(false);
      }
      videoDuration.current = e.duration * 1000;
    };

    const onVideoProgress = ({currentTime}: {currentTime: number}) => {
      setOnLoading(false);
      // videoとアニメーションを合わせるためにvideoが始まり次第即座にプログレスバーのアニメーションを開始させている
      // onProgressはビデオ再生中一定間隔で実行されるので、何度もアニメーションの実行が起こらないようにcanStartVideoで制御
      if (currentTime > 0.002 && canStartVideo.current) {
        progressAnimation({
          progressNumber: currentProgressBar.current,
          duration: videoDuration.current,
        });
        if (canStartVideo.current) {
          canStartVideo.current = false;
        }
      }
    };

    const onVideoSeek = () => {
      if (!isDisplayed || isNavigatedToPofile) {
        setIsPaused(true);
      }
    };

    const onVideoEnd = () => {
      // ビデオの再生が終わったらまたビデオとアニメーションをリンクできるように値を変更
      canStartVideo.current = true;
    };

    const {top} = useSafeAreaInsets();

    return (
      <View style={styles.container}>
        {entityLength ? (
          <>
            <WideRangeSourceContainer>
              <TouchableOpacity
                activeOpacity={1}
                delayLongPress={100}
                disabled={showModal}
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
                      onEnd: onVideoEnd,
                      ignoreSilentSwitch: 'ignore',
                    }}
                  />
                )}
              </TouchableOpacity>
            </WideRangeSourceContainer>
            <View style={[styles.info, {top: top + 10}]}>
              <ProgressBar
                flashesData={flashesData}
                entityLength={entityLength}
                alreadyViewedLength={
                  alreadyViewedLength ? alreadyViewedLength : 0
                }
                progressAnim={progressAnim}
                progressBarWidth={progressBarWidth}
                currentProgressBar={currentProgressBar}
                firstEntitiesLength={firstEntitiesLength}
              />
              <InfoItems
                userData={userData}
                timestamp={currentFlash.timestamp}
                setIsNavigatedToProfile={setIsNavigatedToProfile}
              />
              {creatingFlash && referenceId === userData.userId && (
                <View style={styles.addMessageContainer}>
                  <ActivityIndicator color="white" />
                  <Text style={styles.addMessage}>新しく追加しています</Text>
                </View>
              )}
            </View>
            {referenceId === userData.userId && (
              <View style={styles.showModalButtonContainer}>
                <ShowModalButton
                  modalizeRef={modalizeRef}
                  setShowModal={setShowModal}
                  setIsPaused={setIsPaused}
                  currentProgressBar={currentProgressBar}
                  progressAnim={progressAnim}
                />
              </View>
            )}
            {/* {onLoading && (
              <ActivityIndicator size="large" style={styles.indicator} />
            )} */}
            <Modal
              flashId={currentFlash.id}
              modalizeRef={modalizeRef}
              setShowModal={setShowModal}
              setIsPaused={setIsPaused}
              currentProgressBar={currentProgressBar}
              videoDuration={videoDuration}
              progressAnimation={progressAnimation}
            />
          </>
        ) : (
          creatingFlash && (
            <View style={styles.creatingWideRangeSourceContainer}>
              <View style={styles.creatingFlashMessage}>
                <ActivityIndicator color="white" />
                <Text style={{color: 'white'}}>追加しています</Text>
              </View>
            </View>
          )
        )}
      </View>
    );
  },
);

const {height, width} = Dimensions.get('window');

const MAX_PROGRESS_BAR = width - 20;

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
    bottom: '4%',
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
});

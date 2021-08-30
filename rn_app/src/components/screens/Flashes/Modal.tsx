import React, {useMemo, useCallback} from 'react';
import {TouchableOpacity, StyleSheet, Text, Alert} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {ListItem, Icon} from 'react-native-elements';

import {useDeleteFlash} from '~/hooks/flashes';
import {InstaLikeModal} from '~/components/utils/InstaLikeModal';

type Props = {
  flashId: number;
  userId: string;
  modalizeRef: React.RefObject<Modalize>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  currentProgressBar: React.MutableRefObject<number>;
  videoDuration: React.MutableRefObject<number | undefined>;
  progressAnimation: ({
    progressNumber,
    duration,
    restart,
  }: {
    progressNumber: number;
    duration?: number | undefined;
    restart?: boolean | undefined;
  }) => void;
};

export const Modal = ({
  flashId,
  userId,
  modalizeRef,
  setShowModal,
  setIsPaused,
  currentProgressBar,
  videoDuration,
  progressAnimation,
}: Props) => {
  const {deleteFlash} = useDeleteFlash();

  const onDeletePress = useCallback(async () => {
    Alert.alert('本当に削除してもよろしいですか?', '', [
      {
        text: '削除',
        style: 'destructive',
        onPress: async () => {
          await deleteFlash({flashId});

          modalizeRef.current?.close();
        },
      },
      {
        text: 'いいえ',
        onPress: () => {
          return;
        },
      },
    ]);
  }, [deleteFlash, modalizeRef, flashId]);

  const modalList = useMemo(
    () => [
      {
        title: '削除',
        icon: 'delete-outline',
        titleStyle: {fontSize: 18, color: '#f74a4a'},
        onPress: () => {
          onDeletePress();
        },
      },
    ],
    [onDeletePress],
  );

  return (
    <Modalize
      ref={modalizeRef}
      modalHeight={140}
      scrollViewProps={{scrollEnabled: false}}
      onClosed={() => {
        setIsPaused(false);
        progressAnimation({
          progressNumber: currentProgressBar.current,
          duration: videoDuration ? videoDuration.current : undefined,
          restart: true,
        });
        setShowModal(false);
      }}>
      {modalList.map((item, i) => (
        <ListItem
          key={i}
          style={{marginTop: 10}}
          onPress={() => {
            if (item.onPress) {
              switch (item.title) {
                case '削除':
                  item.onPress();
              }
            }
          }}>
          {item.icon && (
            <Icon
              name={item.icon}
              color={item.titleStyle && item.titleStyle.color}
            />
          )}
          <ListItem.Content>
            <ListItem.Title style={item.titleStyle && item.titleStyle}>
              {item.title}
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}
      <TouchableOpacity
        activeOpacity={1}
        style={styles.modalCancel}
        onPress={() => {
          modalizeRef.current?.close();
        }}>
        <Text style={{fontSize: 18, color: '#575757'}}>キャンセル</Text>
      </TouchableOpacity>
    </Modalize>
  );
};

const styles = StyleSheet.create({
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

type _Props = {
  isVisible: boolean;
  closeModal: () => void;
};

export const _Modal = React.memo(({isVisible, closeModal}: _Props) => {
  return (
    <InstaLikeModal
      isVisible={isVisible}
      list={[{title: '削除', color: 'red', onPress: () => {}}]}
      onCancel={closeModal}
      onBackdropPress={closeModal}
    />
  );
});

import React, {useMemo, useCallback} from 'react';
import {TouchableOpacity, StyleSheet, Text, Alert} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {ListItem, Icon} from 'react-native-elements';

import {deleteFlashThunk} from '../../../thunks/flashes/deleteFlash';
import {useCustomDispatch} from '~/hooks/stores';

type Props = {
  flashId: number;
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
  modalizeRef,
  setShowModal,
  setIsPaused,
  currentProgressBar,
  videoDuration,
  progressAnimation,
}: Props) => {
  const dispatch = useCustomDispatch();

  const deleteFlash = useCallback(async () => {
    Alert.alert('本当に削除してもよろしいですか?', '', [
      {
        text: '削除',
        style: 'destructive',
        onPress: async () => {
          await dispatch(deleteFlashThunk({flashId}));
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
  }, [dispatch, modalizeRef, flashId]);

  const modalList = useMemo(
    () => [
      {
        title: '削除',
        icon: 'delete-outline',
        titleStyle: {fontSize: 18, color: '#f74a4a'},
        onPress: () => {
          deleteFlash();
        },
      },
    ],
    [deleteFlash],
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

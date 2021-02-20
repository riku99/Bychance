import React, {useMemo} from 'react';
import {TouchableOpacity, StyleSheet, Text} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {ListItem, Icon, Button} from 'react-native-elements';

type Props = {
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
  modalizeRef,
  setShowModal,
  setIsPaused,
  currentProgressBar,
  videoDuration,
  progressAnimation,
}: Props) => {
  const modalList = useMemo(
    () => [
      {
        title: '削除',
        icon: 'delete-outline',
        titleStyle: {fontSize: 18, color: '#f74a4a'},
        onPress: () => {
          console.log('ok');
        },
      },
    ],
    [],
  );

  return (
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
        setShowModal(false);
      }}>
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

{
  /* <Modalize
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
          {item.icon && <Icon name={item.icon} color={item.titleStyle.color} />}
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
      <Text style={{fontSize: 18, color: '#575757'}}>キャンセル</Text>
    </TouchableOpacity>
  </View>
</Modalize>; */
}

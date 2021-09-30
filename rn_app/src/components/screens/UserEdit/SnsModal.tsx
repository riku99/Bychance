import React, {useRef, useEffect, useMemo, useState} from 'react';
import {Dimensions, StyleSheet, View, Text, TextInput} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Button} from 'react-native-elements';

import {SnsList} from '~/types';
import {X_HEIGHT} from '~/constants/device';
import {defaultTheme} from '~/theme';

type Props = {
  show: SnsList;
  onClose: () => void;
  text: string | null;
  setContents?: (t: string | null) => void;
};

export const SnsModal = React.memo(
  ({show, onClose, text, setContents}: Props) => {
    const modalRef = useRef<Modalize>(null);
    const inputRef = useRef<TextInput>(null);
    const [inputText, setInputText] = useState<string | null>(text);

    useEffect(() => {
      if (show && modalRef.current) {
        modalRef.current.open();
      }
    }, [show]);

    const {title, placeholder} = useMemo(() => {
      switch (show) {
        case 'instagram':
          return {
            title: 'Instagram',
            placeholder: 'ユーザーネームを入力してください',
          };
        case 'twitter':
          return {
            title: 'Twitter',
            placeholder: 'ユーザー名を入力してください (@はいらないです)',
          };
        case 'youtube':
          return {
            title: 'Youtube',
            placeholder: '自身のチャンネルのURLを入力してください',
          };
        case 'tiktok':
          return {
            title: 'TikTok',
            placeholder: 'ユーザー名を入力してください (@はいらないです)',
          };
      }
    }, [show]);

    const onEndButtonPress = () => {
      if (modalRef.current) {
        modalRef.current.close();
        if (setContents) {
          setContents(inputText ? inputText : null);
        }
      }
    };

    return (
      <Modalize
        ref={modalRef}
        onClose={onClose}
        modalHeight={modalHeight}
        scrollViewProps={{
          keyboardShouldPersistTaps: 'always',
          scrollEnabled: false,
        }}
        onLayout={() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }}>
        <View style={styles.container}>
          <View style={styles.topItemContainer}>
            <Text style={styles.title}>{title}</Text>
            <Button
              title="完了"
              onPress={onEndButtonPress}
              buttonStyle={styles.endButton}
              titleStyle={styles.endButtonTitle}
              activeOpacity={1}
            />
          </View>
          <View style={styles.alertTextContainer}>
            <Text style={styles.alertText}>
              大文字小文字、スペースなどに注意して正確に入力してください
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder={placeholder}
              defaultValue={inputText ? inputText : undefined}
              onChangeText={(t) => setInputText(t)}
            />
          </View>
        </View>
      </Modalize>
    );
  },
);

const {height} = Dimensions.get('screen');

const modalHeight = X_HEIGHT > height ? height / 1.4 : height / 1.5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: modalHeight / 1.5,
    width: '95%',
    marginTop: 27,
    alignSelf: 'center',
  },
  topItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  endButton: {
    backgroundColor: 'transparent',
  },
  endButtonTitle: {
    fontWeight: 'bold',
    color: defaultTheme.blueText,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
  },
  inputContainer: {
    marginTop: 20,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 0.5,
  },
  input: {
    width: '100%',
    height: 50,
    fontSize: 15,
  },
  alertTextContainer: {
    marginTop: 10,
  },
  alertText: {
    color: 'orange',
    fontSize: 12,
  },
});

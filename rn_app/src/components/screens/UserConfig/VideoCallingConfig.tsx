import React, {useMemo, useState} from 'react';
import {View, Switch} from 'react-native';
import {commonStyles} from './constants';
import {ConfigList} from './List';
import {useVideoCallingEnabled} from '~/hooks/settings';

const VideoCallingEnabledSwitch = () => {
  const {
    videoCallingEnabled,
    changeVideoCallingEnabled,
  } = useVideoCallingEnabled();
  const [switchValue, setSwitchValue] = useState(videoCallingEnabled);
  const onValueChange = async (v: boolean) => {
    setSwitchValue(v);
    const result = await changeVideoCallingEnabled(v);
    if (!result) {
      setSwitchValue(!v);
    }
  };

  return <Switch value={switchValue} onValueChange={onValueChange} />;
};

export const VideoCallingConfig = () => {
  const list = useMemo(() => {
    return [
      {
        title: 'ビデオ通話を受け取る',
        switch: <VideoCallingEnabledSwitch />,
      },
    ];
  }, []);
  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.sectionContainer}>
        <ConfigList list={list} />
      </View>
    </View>
  );
};

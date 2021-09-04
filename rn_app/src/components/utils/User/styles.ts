import {Dimensions} from 'react-native';
import {judgeMoreDeviceX} from '~/helpers/device';

const {height} = Dimensions.get('screen');
const moreXHeight = judgeMoreDeviceX();
export const profileContainerHeight = moreXHeight
  ? height / 1.9
  : height / 1.75;
export const oneIntroduceTextLineHeght = 19.7;
export const backgroundItemHeight = height * 0.16;
export const editProfileOrSendMessageButtonContainerTop =
  backgroundItemHeight + 10;
export const avatarContainerTop =
  backgroundItemHeight - (moreXHeight ? height * 0.04 : height * 0.045);
export const nameContainerTop = avatarContainerTop + 97;
export const nameAndAvatarLeft = 13;
export const introduceContainerTop = nameContainerTop + 30;
export const creatingFlashContainerTop = backgroundItemHeight + 13;

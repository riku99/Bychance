import {showMessage, MessageOptions} from 'react-native-flash-message';

export const displayShortMessage = (
  text: string,
  type: MessageOptions['type'],
) => {
  showMessage({
    message: text,
    type: type,
    style: {opacity: 0.9},
    titleStyle: {fontWeight: 'bold'},
  });
};

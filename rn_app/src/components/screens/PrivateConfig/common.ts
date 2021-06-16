import {StyleSheet} from 'react-native';

const fontColor = '#4d4d4d';
export const commonStyles = StyleSheet.create({
  descriptionButton: {
    backgroundColor: 'transparent',
    width: 180,
    marginTop: 10,
  },
  descriptionButtonTitle: {
    color: fontColor,
    fontSize: 15,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

export const commonModalStyles = StyleSheet.create({
  modalContainer: {
    marginHorizontal: 10,
    marginTop: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  explanation: {
    marginTop: 15,
    lineHeight: 17,
    fontSize: 16,
    color: '#4d4d4d',
  },
});

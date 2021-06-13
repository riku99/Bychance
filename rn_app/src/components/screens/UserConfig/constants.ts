import {StyleSheet} from 'react-native';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  sectionContainer: {
    marginTop: 30,
  },
  switch: {
    transform: [{scaleX: 0.8}, {scaleY: 0.8}],
  },
  descriptionModal: {
    width: '85%',
    height: 200,
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 10,
  },
  descriptionText: {
    fontSize: 16,
    marginHorizontal: 10,
    marginVertical: 10,
    lineHeight: 18,
  },
});

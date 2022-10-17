import {StyleSheet} from 'react-native';
import {colours, sizes} from '../../constants';

const styles = StyleSheet.create({
  resultCategoryTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colours.white,
    marginLeft: sizes.marginListX,
    marginRight: sizes.marginListX,
    marginTop: sizes.marginListY,
    marginBottom: sizes.marginListY,
  },
  resultContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: colours.grey['600'],
    marginLeft: sizes.marginListX / 2,
    paddingRight: sizes.marginListX / 2,
    paddingBottom: sizes.marginListY / 2,
    paddingTop: sizes.marginListY / 2,
  },
  resultsContainer: {
    flex: 1,
    width: '95%',
    justifyContent: 'center',
  },
  resultText: {
    color: colours.white,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: sizes.marginListX,
    flexShrink: 1,
  },
  image: {
    height: 40,
    width: 40,
  },
});

export {styles};

import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {colours, sizes} from '@boum/constants';
import Icon from 'react-native-vector-icons/Ionicons';
import {CustomHomeListItem} from '@boum/types';
import {NavigationProp} from '@react-navigation/native';

const width = Dimensions.get('window').width;

type HeaderHomeProps = {
  navigation: NavigationProp<any>;
  data: Array<CustomHomeListItem>;
};

const CustomHomeLists: React.FC<HeaderHomeProps> = ({navigation, data}) => {
  return (
    <View>
      <Text style={styles.title}>Your Custom Lists</Text>
      <View style={styles.container}>
        {data.map(item => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('List', {
                listTitle: item.title,
                sortBy: item.sortBy,
                sortOrder: item.sortOrder,
                filters: item.filters,
                genreId: item.genreId,
                searchQuery: item.searchQuery,
              })
            }
            key={item.title}>
            <View style={styles.itemContainer}>
              <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
                {item.title}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        {data.length === 0 ? (
          <TouchableOpacity onPress={() => navigation.navigate('ListManager')}>
            <View style={styles.itemContainer}>
              <Text style={styles.text}>
                <Icon name={'add'} size={20} />
                New List
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: colours.grey[100],
    fontSize: 18,
    paddingTop: 15,
    fontFamily: 'Inter-SemiBold',
    paddingHorizontal: sizes.marginListX,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: width * 0.05,
  },
  itemContainer: {
    width: width * 0.45,
    maxWidth: width * 0.45,
    paddingHorizontal: width * 0.05,
    paddingVertical: width * 0.02,
    marginHorizontal: width * 0.025,
    marginVertical: width * 0.02,
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    shadowColor: '#2a2a2a',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,
    elevation: 13,
  },
  text: {
    color: colours.grey[100],
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});

export {CustomHomeLists};

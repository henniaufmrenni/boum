import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';

import {colours} from '@boum/constants';
import Icon from 'react-native-vector-icons/Ionicons';
import {Filters, Session, SortBy, SortOrder, SuccessMessage} from '@boum/types';
import {Picker} from '@react-native-picker/picker';
import {jellyfinClient} from '@boum/lib/api';
import ButtonBoum from '@boum/components/Settings/ButtonBoum';
import {LoadingSpinner} from '@boum/components/Generic';
import {saveCustomList} from '@boum/lib/db/customLists';
import {useStore} from '@boum/hooks';

type CustomListCreatorProps = {
  session: Session;
};

const CustomListCreator: React.FC<CustomListCreatorProps> = ({session}) => {
  const jellyfin = new jellyfinClient();

  const triggerRefreshHomeScreen = useStore(
    state => state.setRefreshHomeScreen,
  );

  const {allGenres, allGenresLoading} = jellyfin.getAllGenres(session);

  const [listTitle, setListTitle] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortBy>('SortName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('Ascending');
  const [genreId, setGenreId] = useState<string>('');
  const [filters, setFilters] = useState<Filters>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [successSaving, setSuccessSaving] =
    useState<SuccessMessage>('not triggered');
  return (
    <>
      {!allGenresLoading && allGenres !== undefined ? (
        <View style={styles.container}>
          <Text style={styles.text}>
            You can create custom lists by selecting different paramaters by
            which you want your albums filtered.
          </Text>

          <Text style={styles.text}>Select a Genre</Text>
          <Picker
            selectedValue={genreId}
            onValueChange={itemValue => setGenreId(itemValue)}
            enabled={true}
            prompt={'Select a Genre:'}
            itemStyle={styles.picker}>
            <Picker.Item
              label={'All genres'}
              value={''}
              style={styles.pickerItem}
            />
            {allGenres.Items.map(genre => (
              <Picker.Item
                label={genre.Name}
                value={genre.Id}
                key={genre.Id}
                style={styles.pickerItem}
              />
            ))}
          </Picker>

          <Text style={styles.text} style={styles.text}>
            Sort by
          </Text>
          <Picker
            selectedValue={sortBy}
            onValueChange={itemValue => setSortBy(itemValue)}
            prompt={'Select sort order:'}>
            <Picker.Item
              label="Name"
              value={'SortName'}
              style={styles.pickerItem}
            />
            <Picker.Item
              label="Random"
              value={'Random'}
              style={styles.pickerItem}
            />
            <Picker.Item
              label="Time added to library"
              value={'DateCreated'}
              style={styles.pickerItem}
            />
          </Picker>

          <Text style={styles.text} style={styles.text}>
            Sort order
          </Text>
          <Picker
            selectedValue={sortOrder}
            onValueChange={itemValue => setSortOrder(itemValue)}
            prompt={'Select sort order:'}>
            <Picker.Item
              label="Ascending"
              value={'Ascending'}
              style={styles.pickerItem}
            />
            <Picker.Item
              label="Descending"
              value={'Descending'}
              style={styles.pickerItem}
            />
          </Picker>

          <Text style={styles.text} style={styles.text}>
            Filter favorites
          </Text>
          <Picker
            selectedValue={filters}
            onValueChange={itemValue => setFilters(itemValue)}
            prompt={'Select favorites:'}>
            <Picker.Item label="All" value={''} style={styles.pickerItem} />
            <Picker.Item
              label="Only favorites"
              value={'IsFavorite'}
              style={styles.pickerItem}
            />
          </Picker>

          <Text style={styles.text} style={styles.text}>
            Search query
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={input => setSearchQuery(input)}
            value={searchQuery}
            placeholder={'Search'}
            autoCapitalize={'none'}
            autoCorrect={false}
            secureTextEntry={false}
            placeholderTextColor={colours.grey[500]}
            accessibilityLabel={'search query input'}
          />

          <Text style={styles.text} style={styles.text}>
            List name*
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={input => setListTitle(input)}
            value={listTitle}
            placeholder={'List title'}
            autoCapitalize={'none'}
            autoCorrect={false}
            secureTextEntry={false}
            placeholderTextColor={colours.grey[500]}
            accessibilityLabel={'password input'}
          />

          {successSaving === 'success' ? (
            <View style={styles.successContainer}>
              <Text style={styles.text}>
                <Icon name="checkmark-circle" size={25} color={colours.green} />
                Success saving list
              </Text>
            </View>
          ) : null}
          <View style={styles.buttonContainer}>
            <ButtonBoum
              title={'Create List'}
              isDisabled={listTitle === '' ? true : false}
              onPress={() => {
                saveCustomList({
                  title: listTitle,
                  sortOrder: sortOrder,
                  sortBy: sortBy,
                  filters: filters,
                  searchQuery: searchQuery,
                  genreId: genreId,
                }).then(() => {
                  setSuccessSaving('success');
                  setListTitle('');
                  setSortBy('DateCreated');
                  setSortOrder('Ascending');
                  setGenreId('');
                  setFilters('');
                  setSearchQuery('');
                  triggerRefreshHomeScreen();
                });
              }}
            />
          </View>
        </View>
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexWrap: 'nowrap',
    paddingHorizontal: 15,
    justifyContent: 'flex-start',
  },
  title: {
    color: colours.grey[100],
    fontSize: 18,
    paddingTop: 15,
    fontFamily: 'Inter-SemiBold',
  },
  text: {
    color: colours.grey[100],
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    paddingTop: 20,
    flex: 1,
    flexWrap: 'wrap',
  },
  input: {
    height: 45,
    fontSize: 16,
    width: '100%',
    marginVertical: 12,
    borderWidth: 1,
    borderColor: colours.grey['500'],
    color: colours.white,
    fontFamily: 'Inter-Medium',
    padding: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  picker: {
    color: colours.white,
    backgroundColor: colours.white,
  },
  pickerItem: {
    color: colours.black,
    backgroundColor: colours.white,
  },
  successContainer: {
    alignItems: 'center',
  },
});

export {CustomListCreator};

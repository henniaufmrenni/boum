import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {SortBy, SortOrder} from '@boum/types';

import {colours, sizes} from '@boum/constants';

type LibraryHeaderProps = {
  text: string;
  sortBy: SortBy;
  setSortBy: (value: SortBy | ((prevState: SortBy) => SortBy)) => void;
  mutate: () => void;
  sortOrder: SortOrder;
  setSortOrder: (
    value: SortOrder | ((prevState: SortOrder) => SortOrder),
  ) => void;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  disableFiltering?: boolean;
  modalOpen: boolean;
  setModalOpen: (arg0: boolean) => void;
};

class LibraryHeader extends React.PureComponent<LibraryHeaderProps> {
  render() {
    return (
      <View>
        <View style={styles.container}>
          <Text style={styles.text}>{this.props.text}</Text>
          <View>
            {!this.props.disableFiltering ? (
              <TouchableOpacity
                style={styles.openButtonContainer}
                onPress={() => this.props.setModalOpen(!this.props.modalOpen)}>
                <Text>
                  <Icon name="filter" size={30} color={colours.white} />
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        {this.props.modalOpen ? (
          <>
            <TextInput
              style={styles.input}
              onChangeText={this.props.setSearchTerm}
              value={this.props.searchTerm}
              placeholder="..."
              placeholderTextColor={colours.grey[500]}
            />
            <View style={styles.buttonsContainer}>
              {this.props.sortBy === 'SortName' ? (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.setSortBy('DateCreated');
                      this.props.setSortOrder('Descending');
                      this.props.mutate();
                    }}
                    style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Alphabetical</Text>
                  </TouchableOpacity>
                </>
              ) : this.props.sortBy === 'DateCreated' ? (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.setSortBy('Random');
                      this.props.mutate();
                    }}
                    style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Newest</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.setSortBy('SortName');
                      this.props.setSortOrder('Ascending');
                      this.props.mutate();
                    }}
                    style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Random</Text>
                  </TouchableOpacity>
                </>
              )}
              {this.props.sortOrder === 'Ascending' ? (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.setSortOrder('Descending');
                      this.props.mutate();
                    }}
                    style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Descending</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.setSortOrder('Ascending');
                      this.props.mutate();
                    }}
                    style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Ascending</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 30,
    width: '100%',
  },
  text: {
    fontSize: 40,
    fontFamily: 'Inter-SemiBold',
    fontWeight: sizes.fontWeightPrimary,
    color: colours.white,
    paddingLeft: sizes.marginListX,
    paddingVertical: sizes.marginListX / 2,
    flex: 1,
  },
  openButtonContainer: {
    flex: 1,
    paddingRight: sizes.marginListX,
    justifyContent: 'center',
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: sizes.marginListX,
  },
  buttonText: {
    color: colours.white,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  buttonContainer: {
    flex: 1,
    borderWidth: 1,
    width: '40%',
    borderBackground: colours.grey['800'],
    borderColor: colours.grey['500'],
    paddingLeft: sizes.marginListX / 2,
    paddingRight: sizes.marginListX / 2,
    paddingTop: sizes.marginListY / 2,
    paddingBottom: sizes.marginListY / 2,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: sizes.marginListX / 2,
  },
  input: {
    backgroundColor: colours.black,
    color: colours.white,
    width: '95%',
    alignSelf: 'center',
    borderColor: colours.grey['500'],
    borderWidth: 1,
    padding: 12,
    height: 45,
    fontFamily: 'Inter-Regular',
    borderRadius: 10,
  },
});

export default LibraryHeader;

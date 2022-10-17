import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {colours, sizes} from '@boum/constants';
import {getHourMinutes} from '@boum/lib/helper/helper';

type ListFooterMetaInformationProps = {
  albumItems: Array<object>;
  item: object;
};

class ListFooterMetaInformation extends React.PureComponent<ListFooterMetaInformationProps> {
  runTime = getHourMinutes(this.props.item.RunTimeTicks);

  render() {
    return (
      <View style={listFooterStyle.container}>
        <Text style={listFooterStyle.text}>
          Year {this.props.item.ProductionYear} {'\n'}
          {this.props.albumItems.TotalRecordCount} Tracks • {this.runTime}
        </Text>
      </View>
    );
  }
}

const listFooterStyle = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: colours.black,
    paddingLeft: sizes.marginListX,
  },
  text: {
    fontSize: sizes.fontSizePrimary,
    fontWeight: sizes.fontWeightPrimary,
    color: colours.white,
    lineHeight: 28,
  },
});

export default ListFooterMetaInformation;

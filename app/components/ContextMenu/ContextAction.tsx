import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {colours, sizes} from '@boum/constants';

type ContextActionProps = {
  title: string;
  ioniconIcon: string;
  action: () => void;
  children?: React.ReactNode;
  actionStatusMessage?: React.ReactNode;
};

const ContextAction = ({
  title,
  ioniconIcon,
  action,
  children,
  actionStatusMessage,
}: ContextActionProps): React.ReactNode => {
  return (
    <TouchableOpacity onPress={() => action()}>
      <View>
        <View style={contextActionStyles.container}>
          <Icon
            name={ioniconIcon}
            size={25}
            color={colours.white}
            style={contextActionStyles.icon}
          />
          <Text style={contextActionStyles.title}>
            {title} {actionStatusMessage}
          </Text>
        </View>
        {children}
      </View>
    </TouchableOpacity>
  );
};
const contextActionStyles = StyleSheet.create({
  container: {
    paddingHorizontal: sizes.marginListX,
    paddingVertical: sizes.marginListX / 2,
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'row',
  },
  actionButton: {
    flex: 1,
    alignSelf: 'center',
  },
  title: {
    color: colours.white,
    fontSize: 17,
    fontFamily: 'Inter-Medium',
    marginLeft: 15,
  },
});

export {ContextAction};

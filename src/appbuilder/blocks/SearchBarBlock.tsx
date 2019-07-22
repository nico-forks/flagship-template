import React, { Component } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';

import { SearchBar } from '@brandingbrand/fscomponents';

const styles = StyleSheet.create({
  default: {
    color: '#000'
  },
  searchBarInner: {
    borderWidth: 0,
    borderRadius: 5,
    backgroundColor: '#f5f5f5'
  },
  searchBarInputTextStyle: {
    height: 40
  }
});
const searchIcon = require('../../../assets/images/search.png');
type Navigator = import ('react-native-navigation').Navigator;

export interface SearchBarBlockProps {
  navigator: Navigator;
  text: string;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  searchBarInner?: StyleProp<ViewStyle>;
  searchBarInputTextStyle?: StyleProp<ViewStyle>;
  key: string;
  showSearchIcon?: boolean;
  placeholder?: string;
}
export default class SearchBarBlock extends Component<SearchBarBlockProps> {
  showSearchScreen = () => {
//    return false;
    this.props.navigator.push({
      screen: 'Search',
      animated: false,
      passProps: {
        onCancel: () => {
          this.props.navigator.pop({ animated: false });
        }
      }
    });
  }
  render(): JSX.Element {
    const {
      containerStyle,
      placeholder = 'Search',
      searchBarInner,
      searchBarInputTextStyle,
      showSearchIcon
    } = this.props;
    return (
      <View style={containerStyle}>
        <SearchBar
          containerStyle={[styles.searchBarInner, searchBarInner]}
          inputTextStyle={[styles.searchBarInputTextStyle, searchBarInputTextStyle]}
          searchIcon={searchIcon}
          showSearchIcon={showSearchIcon}
          placeholder={placeholder}
        />
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={this.showSearchScreen}
        >
          <View />
        </TouchableOpacity>
      </View>
    );
  }
}

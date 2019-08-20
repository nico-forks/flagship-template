// tslint:disable: jsx-use-translation-function ter-max-len

import React, { Component } from 'react';
import { Text } from 'react-native';
import PSScreenWrapper from '../components/PSScreenWrapper';
import { NavigatorStyle, ScreenProps } from '../lib/commonTypes';
import { navBarDefault } from '../styles/Navigation';

export default class Development extends Component<ScreenProps> {
  static navigatorStyle: NavigatorStyle = navBarDefault;

  render(): JSX.Element {
    const { navigator } = this.props;
    return (
      <PSScreenWrapper
        hideGlobalBanner={true}
        navigator={navigator}
      >
        <Text>Use this screen for development purposes such as linking to in-progress screens or components.</Text>
        <Text>You can access it by tapping the version number on the bottom right of the app.</Text>
      </PSScreenWrapper>
    );
  }
}

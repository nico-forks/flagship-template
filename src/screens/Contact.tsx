import React, { Component } from 'react';

import WebView from 'react-native-webview';

import {
  NavigatorStyle, ScreenProps
} from '../lib/commonTypes';

import PSScreenWrapper from '../components/PSScreenWrapper';
import { navBarShopScreen } from '../styles/Navigation';

export default class Contact extends Component<ScreenProps> {
  static navigatorStyle: NavigatorStyle = navBarShopScreen;

  render(): JSX.Element {
    return (
      <PSScreenWrapper
        style={{ flex: 1, marginTop: 10}}
        navigator={this.props.navigator}
        scroll={false}
      >
        <WebView style={{ flex: 1 }} source={{ uri: 'https://www.brandingbrand.com/contact' }} />
      </PSScreenWrapper>
    );
  }
}

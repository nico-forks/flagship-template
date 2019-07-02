import React, { Component } from 'react';
import { Image } from 'react-native';

import { backButton/*, searchButton*/ } from '../lib/navStyles';
import { navBarDefault } from '../styles/Navigation';
import { NavButton, NavigatorStyle, ScreenProps } from '../lib/commonTypes';

import PSScreenWrapper from '../components/PSScreenWrapper';
import PSProductIndex from '../components/PSProductIndex';

export interface ProductIndexProps extends ScreenProps {
  categoryId: string; // passed by Navigator
  title?: string; // passed by Navigator
}

const headerImages: {[key: string]: HTMLImageElement} = {
  shoes: require('../../assets/images/landing/Mens-Shoes.png'),
  jackets: require('../../assets/images/landing/Mens-Jackets.png'),
  shirts: require('../../assets/images/landing/Mens-Shirts.png'),
  sweatshirts: require('../../assets/images/landing/Mens-Sweatshirts.png'),
  dresses: require('../../assets/images/landing/Womens-Dresses.png'),
  tees: require('../../assets/images/landing/Womens-Tees.png'),
  bottoms: require('../../assets/images/landing/Womens-Bottoms.png'),
  'shoes-w': require('../../assets/images/landing/Womens-Shoes.png'),
  handbags: require('../../assets/images/landing/Womens-Handbags.png')
};

export default class ProductIndex extends Component<ProductIndexProps> {
  static navigatorStyle: NavigatorStyle = navBarDefault;
  static leftButtons: NavButton[] = [backButton];
  // static rightButtons: NavButton[] = [searchButton];

  render(): JSX.Element {
    const { navigator } = this.props;

    return (
      <PSScreenWrapper
        navigator={navigator}
      >
        {headerImages[this.props.categoryId] &&
          <Image
            resizeMode='cover'
            style={{width: '100%'}}
            source={headerImages[this.props.categoryId]}
          />}
        <PSProductIndex {...this.props} />
      </PSScreenWrapper>
    );
  }
}

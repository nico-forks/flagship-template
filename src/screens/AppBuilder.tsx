/* tslint:disable:jsx-use-translation-function */

import React, { Component } from 'react';

import {
  Keyboard,
  Linking,
  Platform
} from 'react-native';

import { AppBuilderComponent } from '../lib/appbuilder';
import { fetchPages } from '../providers/appbuilderProvider';

import PSScreenWrapper from '../components/PSScreenWrapper';


import { handleDeeplink } from '../lib/deeplinkHandler';

import { navBarShopScreen } from '../styles/Navigation';
import { NavigatorStyle, ScreenProps } from '../lib/commonTypes';
import { CombinedStore } from '../reducers';
import { dataSourceConfig } from '../lib/datasource';
import { connect } from 'react-redux';


export interface AppBuilderProps extends ScreenProps {
  fetchPages: () => void;
  stories: any[];
  isLoading: boolean;
  account?: any;
  blocks: any;
}
export class AppBuilder extends Component<AppBuilderProps> {
  static navigatorStyle: NavigatorStyle = navBarShopScreen;

  state: any = {
    refreshing: false
  };

  constructor(props: AppBuilderProps) {
    super(props);

    if (Platform.OS !== 'web') {
      Linking.getInitialURL()
        .then(url => {
          if (url) {
            handleDeeplink(url, props.navigator);
          }
        })
        .catch(err => {
          console.warn('Deeplinking error', err);
        });

      Linking.addEventListener('url', event => {
        handleDeeplink(event.url, props.navigator);
      });
    }

    // Listen for navigator events
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    // Add Keyboard listeners to hide tab bar on Android while the keyboard is open.
    // This is global and doesn't need to be added to the other tabs/screens.
    if (Platform.OS !== 'ios') {
      Keyboard.addListener('keyboardDidShow', () => {
        props.navigator.toggleTabs({
          to: 'hidden',
          animated: false
        });
      });

      Keyboard.addListener('keyboardDidHide', () => {
        props.navigator.toggleTabs({
          to: 'shown',
          animated: false
        });
      });
    }
  }

  onNavigatorEvent(event: any): void {
    if (event.type === 'DeepLink') {
      const parts = event.link.split('/');
      if (parts[0] === 'shop') {
        let navAction: any = {
          screen: null
        };

        if (parts[1] === 'product') {
          // navigate to product
          navAction = {
            screen: 'ProductDetail',
            passProps: {
              productId: parts[2]
            }
          };
        }

        if (navAction.screen) {
          // switch to shop tab if it's not already visible
          this.props.navigator
            .screenIsCurrentlyVisible()
            .then(visible => {
              if (!visible) {
                this.props.navigator.switchToTab();
              }
              this.props.navigator.push(navAction);
            })
            .catch(e => null);
        }
      }
    }
  }

  handleCategoryItemPress = (item: any) => {
    // Shopify doesn't have the concept of subcategories so always direct users to product index
    const screen = 'Category';

    this.props.navigator.push({
      screen,
      title: item.title,
      passProps: {
        categoryId: item.id,
        format: dataSourceConfig.categoryFormat
      }
    });
  }
  componentWillMount(): void {
    this.props.fetchPages();
  }

  render(): JSX.Element {
    const { navigator, blocks, account } = this.props;
    const layout = {
      private_blocks: blocks
    };
    // const scrollViewProps: any = {
    //   refreshControl: this.renderRefreshControl()
    // }
    return (
      <PSScreenWrapper
        needInSafeArea={true}
        navigator={navigator}
        hideGlobalBanner={true}
      >
        <AppBuilderComponent
          navigator={navigator}
          noScrollView={true}
          json={layout}
          account={account}
        />
      </PSScreenWrapper>
    );
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    fetchPages: fetchPages(dispatch)
  };
};

const mapStateToProps = (combinedStore: CombinedStore, ownProps: any) => {

  const rawPages = combinedStore.pageBuilder.value || [];
  const appbuilderSlot = [...rawPages].find((page: any) => {
    return page.slotId === 'appbuilder';
  });
  // if (appbuilderSlot && appbuilderSlot.content) {
  //   appbuilderSlot.content = [{
  //     private_type: 'SearchBar',
  //     componentProps: {
  //       containerStyle: {
  //         marginBottom: 10,
  //         paddingHorizontal: 15,
  //         paddingVertical: 10
  //       },
  //       searchBarInner: {
  //         borderWidth: 0,
  //         borderRadius: 5,
  //         backgroundColor: '#f5f5f5'
  //       },
  //       searchBarInputTextStyle: {
  //         height: 40
  //       },
  //       placeholder: 'Search for something',
  //       showSearchIcon: false
  //     }
  //   }];
  // }
  return {
    blocks: (appbuilderSlot && appbuilderSlot.content) || [],
    account: combinedStore.account,
    promoProducts: combinedStore.promoProducts,
    topCategory: combinedStore.topCategory
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppBuilder);

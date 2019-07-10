import React, { Component, ComponentClass, Fragment } from 'react';
import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from 'react-native';

// import {
//   Action,
//   BlockItem,
//   ComponentList,
//   EmitterProps,
//   JSON,
//   ScreenProps
// } from './types';

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    zIndex: 10,
    top: 50,
    left: 8,
    padding: 12
  },
  backIcon: {
    width: 14,
    height: 25
  },
  emptyMessage: {
    textAlign: 'center',
    padding: 20
  },
  container: {
    backgroundColor: '#ffffff',
    flex: 1
  },
  growStretch: {
    alignSelf: 'stretch',
    flexGrow: 1
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 10
  }
});


export default function(
  layoutComponents: any
): ComponentClass<any> {
  return class AppBuilderComp extends Component<any> {
    state: any = {};
    constructor(props: any) {
      super(props);
    }
    renderBlockItem: ListRenderItem<any> = ({ item }) => {
      return this.renderBlock(item);
    }

    renderBlock = (item: any): React.ReactElement | null => {
      const {
        componentProps,
        private_type,
        ...restProps } = item;

      const props = {
        ...restProps,
        ...componentProps
      };

      if (!layoutComponents[private_type]) {
        return null;
      }
      props.navigator = this.props.navigator;
      return React.createElement(
        layoutComponents[private_type],
        {
          ...props,
          key: Math.floor(Math.random() * 1000000)
        }
      );
    }

    renderBlocks(): JSX.Element {
      const { json } = this.props;
      return (
        <Fragment>
          {(json.private_blocks || []).map(this.renderBlock)}
        </Fragment>
      );
    }

    renderScrollView(): JSX.Element {
      if (this.props.noScrollView) {
        return (
          <Fragment>
            {this.renderBlocks()}
          </Fragment>
        );
      }
      return (
        <FlatList
          data={this.props.json.private_blocks || []}
          renderItem={this.renderBlockItem}
          ListEmptyComponent={(
            <Text style={[styles.emptyMessage]}>
              {'No content found.'}</Text>
          )}
          refreshControl={
            this.props.refreshControl && <RefreshControl
              refreshing={this.props.isLoading}
              onRefresh={this.props.refreshControl}
            />
          }
        >
          {this.renderBlocks()}
        </FlatList>
      );
    }

    render(): JSX.Element {
      return (
        <View style={styles.container}>
          {this.renderScrollView()}
        </View>
      );
    }
  };
}
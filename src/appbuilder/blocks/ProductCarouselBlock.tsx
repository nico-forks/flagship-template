import React, { Component } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import {
  MultiCarousel,
  ProductItem,
  ProductItemProps
} from '@brandingbrand/fscomponents';
import { chooseDataSource } from '../../lib/datasource';
import { fontSize, palette } from '../../styles/variables';

const styles = StyleSheet.create({
  brandText: {
    color: palette.secondary
  },
  container: {},
  item: {
    marginLeft: 15
  },
  pageIndicator: {
    display: 'none'
  },
  dotStyle: {
    marginHorizontal: 5
  },
  productTitle: {
    color: palette.secondary,
    fontWeight: 'normal',
    fontSize: 13
  },
  productPriceText: {
    fontSize: 15
  },
  productPrice: {
    justifyContent: 'center',
    marginTop: 5,
    color: palette.secondary
  },
  priceContainer: {
    marginBottom: 0
  },
  reviews: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5
  },
  promoText: {
    color: palette.accent,
    fontSize: fontSize.small,
    fontStyle: 'normal'
  },
  promosContainer: {
    marginTop: 5
  }
});

export interface PSProductCarouselProps {
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  brandStyle?: StyleProp<TextStyle>;
  priceStyle?: StyleProp<TextStyle>;
  items?: ProductItemProps[];
  categoryId?: string;
  dataSource?: any;
  peekSize?: number;
  dotStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  itemsPerPage?: number;
  limit?: number;
}
export interface ProductCarouselState {
  items: ProductItemProps[];
}
export default class PSProductCarousel extends Component<
  PSProductCarouselProps, ProductCarouselState
  > {
  constructor(props: PSProductCarouselProps) {
    super(props);

    this.state = {
      items: props.items || []
    };
  }

  componentWillMount(): void {
    const {
      items,
      dataSource,
      limit = 5
    } = this.props;
    const dsType = dataSource && dataSource.type;
    const apiConfig = dataSource && dataSource.apiConfig;
    const categoryId = this.props.categoryId || '';

    if (dataSource) {
      chooseDataSource(dsType, apiConfig)
        .fetchProductIndex({
          categoryId,
          limit
        })
        .then((data: any) => {
          this.setState({ items: data.products });
        })
        .catch((err: any) => {
          console.error(
            'error when fetching Product Carousel',
            err
          );
        });
    } else if (items) {
      this.setState({ items });
    }
  }

  render(): JSX.Element {
    const {
      itemsPerPage = 4,
      containerStyle,
      peekSize = 50
    } = this.props;
    return (
      <MultiCarousel
        brandStyle={styles.brandText}
        buttonProps={{ palette }}
        itemsPerPage={itemsPerPage}
        peekSize={peekSize}
        style={[styles.container, containerStyle]}
        items={this.state.items}
        pageIndicatorStyle={styles.pageIndicator}
        dotStyle={styles.dotStyle}
        renderItem={this.renderItem}
      />
    );
  }

  renderTitle = (item: ProductItemProps) => (): JSX.Element => {
    return (
      <Text
        style={this.props.titleStyle}
        numberOfLines={2}
        ellipsizeMode='tail'
      >
        {item.title}
      </Text>
    );
  }

  renderItem = (item: ProductItemProps) => {
    const { brandStyle, priceStyle, titleStyle } = this.props;
    return (
      <View style={styles.item}>
        <ProductItem
          brandStyle={brandStyle}
          priceStyle={priceStyle}
          titleStyle={titleStyle}
          reviewStyle={styles.reviews}
          promoStyle={styles.promoText}
          buttonProps={{ palette }}
          promoContainerStyle={styles.promosContainer}
          reviewIndicatorProps={{ itemSize: 15 } as any}
          renderTitle={this.renderTitle(item)}
          {...item}
        />
      </View>
    );
  }
}

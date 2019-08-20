// tslint:disable: jsx-use-translation-function

import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { cloneDeep, find, findIndex } from 'lodash-es';
import {
  Accordion,
  Loading,
  ReviewIndicator,
  ShareButton,
  Swatches,
  ZoomCarousel
} from '@brandingbrand/fscomponents';

import { CombinedStore } from '../reducers';

import { env as projectEnv } from '@brandingbrand/fsapp';

import GlobalStyle from '../styles/Global';

import {
  withProductDetailData,
  WithProductDetailProps,
  WithProductDetailProviderProps
} from '@brandingbrand/fsproductdetail';
import withCart, { CartProps } from '../providers/cartProvider';

import PSButton from './PSButton';
import PSProductCarousel from './PSProductCarousel';
import PSStepper from './PSStepper';
import PSHTMLView from './PSHTMLView';
import PSModal from './PSModal';
import translate, { translationKeys } from '../lib/translations';

import * as variables from '../styles/variables';
import {
  CommerceDataSource,
  CommerceTypes
} from '@brandingbrand/fscommerce';
import PSScreenWrapper from './PSScreenWrapper';

type Navigator = import ('react-native-navigation').Navigator;

const icons = {
  zoom: require('../../assets/images/icon-zoom.png'),
  price: require('../../assets/images/pdp-price-icon.png'),
  delivery: require('../../assets/images/pdp-delivery-icon.png'),
  return: require('../../assets/images/pdp-return-icon.png'),
  verified: require('../../assets/images/verified-purchaser.png'),
  checkmark: require('../../assets/images/check.png'),
  back: require('../../assets/images/arrow.png'),
  share: require('../../assets/images/share.png')
};

const sortedOptions: {[key: string]: number} = {
  XS: 0,
  S: 1,
  M: 2,
  L: 3,
  XL: 4,
  XXL: 5,
  '2XL': 5
};

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  titleContainerLeft: {
    flex: 1
  },
  titleContainerRight: {
    width: 50,
    alignItems: 'flex-end'
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    paddingBottom: 4,
    color: 'black'
  },
  brand: {
    fontSize: 17,
    paddingBottom: 6,
    color: 'black'
  },
  partNumber: {
    fontSize: 11,
    color: variables.color.gray,
    paddingBottom: 6
  },
  originalPrice: {
    fontSize: 14,
    color: variables.color.gray,
    textDecorationLine: 'line-through',
    paddingRight: 10
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: variables.palette.secondary
  },
  savings: {
    fontSize: 13,
    fontWeight: '500',
    color: variables.palette.accent,
    paddingTop: 5
  },
  zoomCarouselDotStyle: {
    height: 0,
    width: 0,
    borderRadius: 4,
    backgroundColor: variables.palette.onPrimary,
    marginHorizontal: 3,
    marginVertical: 5,
    borderWidth: 0.5
  },
  zoomCarouselDotActiveStyle: {
    backgroundColor: variables.palette.primary
  },
  zoomCarouselZoomButtonStyle: {
    right: 15,
    bottom: 8
  },
  row: {
    flexDirection: 'row'
  },
  column: {
    flex: 1
  },
  edgePadding: {
    paddingHorizontal: variables.padding.base
  },
  bottomPadding: {
    flex: 1,
    paddingBottom: variables.padding.base
  },
  tabs: {
    borderTopWidth: variables.border.width,
    borderColor: variables.border.color
  },
  tabRow: {
    borderBottomWidth: variables.border.width,
    borderColor: variables.border.color,
    paddingRight: 15
  },
  modalText: {
    textAlign: 'center'
  },
  miniModal: {
    backgroundColor: 'white',
    padding: variables.padding.base,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4
  },
  iconBarWrapper: {
    paddingTop: 10,
    paddingBottom: 30,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  iconBar: {
    alignItems: 'center'
  },
  iconBarImage: {
    width: 18,
    height: 18,
    marginBottom: 10
  },
  iconBarText: {
    fontSize: 11,
    fontStyle: 'italic',
    textAlign: 'center'
  },
  iconBarSeperator: {
    width: 1,
    height: 30,
    backgroundColor: variables.border.color
  },
  carouselTitle: {
    color: variables.palette.onBackground,
    fontSize: 17,
    fontWeight: '700',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 25,
    paddingBottom: 25
  },
  signInLink: {
    color: variables.palette.primary
  },
  shipsMsg: {
    fontSize: 10,
    paddingBottom: 5
  },
  productFees: {
    color: variables.color.gray,
    paddingTop: 15,
    fontSize: 14,
    fontWeight: '700'
  },
  productCarousel: {
    marginBottom: 20
  },
  atcModal: {
    width: 150,
    backgroundColor: variables.palette.surface,
    padding: 15,
    flexDirection: 'row',
    borderRadius: 3
  },
  atcModalText: {
    fontSize: 15,
    color: variables.palette.onSurface,
    marginLeft: 10
  },
  atcImage: {
    height: 15,
    width: 15
  },
  quantityText: {
    fontWeight: '600',
    fontSize: 15,
    paddingBottom: 6
  },
  quantityView: {
    marginTop: 15
  },
  outOfStockContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  outOfStockMessage: {
    color: 'black',
    fontWeight: 'bold',
    lineHeight: 20
  },
  swatchContainer: {
    marginTop: 10
  },
  sectionTitle: {
    marginHorizontal: 15,
    marginTop: 0,
    paddingTop: 15,
    paddingBottom: 15,
    justifyContent: 'center',
    color: 'black'
  },
  shopButtonsContainer: {
    marginBottom: 15,
    marginHorizontal: 15
  }
});

// TODO: RecentlyViewed and Cart providers should be updated to properly pass types through
export interface UnwrappedPSProductDetailProps extends Pick<CombinedStore, 'promoProducts'> {
  id: string;
  navigator: Navigator;
  onAddToCart?: (data: any) => any; // TODO: Update this with real types
  onOpenHTMLView?: (html: string, title?: string) => void;
}

export type PSProductDetailProps = UnwrappedPSProductDetailProps &
  WithProductDetailProviderProps;

export interface PSProductDetailState {
  id?: string;
  quantity: number;
  optionValues: CommerceTypes.OptionValue[];
  variantId?: string;
  modalVisible: boolean;
  modalContent?: JSX.Element;
  modalTitle?: string;
  miniModalVisible: boolean;
  miniModalContent?: JSX.Element;
  variantImages?: CommerceTypes.Image[];
  variantInStock?: boolean;
  variant?: CommerceTypes.Variant;
}

export type PSProductDetailComponentInternalProps = UnwrappedPSProductDetailProps &
  WithProductDetailProps &
  CartProps;

class PSProductDetailComponent extends Component<
  PSProductDetailComponentInternalProps,
  PSProductDetailState
  > {
  static getDerivedStateFromProps(
    nextProps: PSProductDetailComponentInternalProps,
    state: PSProductDetailState
  ):
    Partial<PSProductDetailState> | null {
    if (nextProps.commerceData && state.id !== nextProps.commerceData.id) {
      const { commerceData } = nextProps;
      const nextState: Partial<PSProductDetailState> = { id: commerceData.id };

      if (!commerceData.variants || commerceData.variants.length === 0) {
        return {
          ...nextState,
          variantId: commerceData.id
        };
      }

      const variant = find(commerceData.variants, { id: commerceData.id })
        || commerceData.variants[0];

      if (variant) {
        return {
          ...nextState,
          variantId: variant.id,
          variant,
          optionValues: cloneDeep(variant.optionValues)
        };
      }

      return nextState;
    }

    return null;
  }

  miniModalTimer: any = null;
  needsImpression: boolean = true;
  screenWidth: number = Dimensions.get('window').width;

  constructor(props: PSProductDetailComponentInternalProps) {
    super(props);

    this.state = {
      modalVisible: false,
      miniModalVisible: false,
      quantity: 1,
      optionValues: [],
      variantInStock: true
    };
  }

  componentDidMount(): void {
    this.needsImpression = true;
  }

  componentDidUpdate(prevProps: PSProductDetailComponentInternalProps): void {
    if (!this.props.commerceData) {
      if (prevProps.commerceData) {
        this.props.navigator.setTitle({ title: '' });
      }

      return;
    }

    const oldTitle = prevProps.commerceData && prevProps.commerceData.title;
    const title = this.props.commerceData && this.props.commerceData.title;

    if (title !== oldTitle) {
      this.props.navigator.setTitle({ title });
    }
  }

  updateOption = (name: string) => (value: string) => {
    if (this.props.commerceData) {
      const { variants } = this.props.commerceData;
      const { optionValues } = this.state;

      // Copy existing options
      const newOptionValues = [...optionValues];
      const optionIndex = findIndex(newOptionValues, { name });
      if (optionIndex === -1) {
        newOptionValues.push({ name, value });
      } else {
        newOptionValues[optionIndex].value = value;
      }

      // Search for matching variant
      const variant = find(variants, { optionValues: newOptionValues }) as any;

      // Update State
      this.setState(prevState => {
        return {
          optionValues: newOptionValues,
          variantId: (variant && variant.id),
          variantImages: (variant && variant.images),
          variantInStock: !!variant,
          variant
        };
      });
    }
  }

  addToCart = () => {
    const { quantity, variantId, variant } = this.state;

    // Optimistically show success and only show errors if necessary
    this.openMiniModal('Added to Cart', 2000);

    if (!quantity || !variantId) {
      // TODO: This error message can be more appropriate
      this.openMiniModal(
        'There was an error adding to cart. Please try again!',
        2000
      );
    } else if (this.props.commerceData) {
      let addToCart = this.props.addToCart(this.props.commerceData, quantity, variant);

      if (this.props.onAddToCart) {
        addToCart = addToCart.then(this.props.onAddToCart);
      }

      // TODO: This error handling can be improved
      addToCart.catch(err => {
        console.warn('An error occurred adding to cart', err);

        this.openMiniModal(
          'There was an error adding to cart. Please try again!',
          2000
        );
      });
    }
  }

  changeQty = (countToAdd: number) => {
    this.setState(prevState => {
      return { quantity: countToAdd };
    });
  }

  openHTMLView = (html: string, title?: string) => () => {
    const { onOpenHTMLView } = this.props;
    if (onOpenHTMLView) {
      onOpenHTMLView(html, title);
    }
  }

  goToProduct = (product: any) => () => {
    this.props.navigator.push({
      screen: 'ProductDetail',
      passProps: {
        productId: product.productId
      }
    });
  }

  openModal = (title: string, content: any, html: boolean = false) => () => {
    let modalContent = content;
    if (html) {
      modalContent = <Text style={styles.modalText}>{content}</Text>;
    }
    this.setState({ modalVisible: true, modalContent, modalTitle: title });
  }

  closeModal = () => {
    this.setState({ modalVisible: false });
  }

  openMiniModal = (content: any, timeout: number = 0) => {
    clearTimeout(this.miniModalTimer);

    const miniModalContent = (
      <View style={styles.atcModal}>
        <Image style={styles.atcImage} source={icons.checkmark} />
        <Text style={styles.atcModalText}>{content}</Text>
      </View>
    );

    this.setState({ miniModalVisible: true, miniModalContent });

    if (timeout > 0) {
      this.miniModalTimer = setTimeout(() => {
        this.closeMiniModal();
      }, timeout);
    }
  }

  closeMiniModal = () => {
    this.setState({ miniModalVisible: false });
  }

  openSignInModal = (navigator: Navigator) => () => {
    navigator.showModal({
      screen: 'SignIn',
      passProps: {
        dismissible: true,
        onDismiss: () => {
          navigator.dismissModal();
        },
        onSignInSuccess: () => {
          navigator.popToRoot({ animated: false });
          navigator.push({
            screen: 'ProductDetail',
            passProps: {
              productId: this.props.id
            }
          });
          navigator.dismissModal();
        }
      }
    });
  }

  renderShareButton = (): React.ReactNode => {
    const commerceData = this.props.commerceData as CommerceTypes.Product & { [key: string]: any };
    const { title } = commerceData;
    const content = {
      title: `I've shared a product from Mosey with you`,
      message: `Check out ${title}!`
    };
    const renderShareIcon = () => {
      return (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10
          }}
        >
          <Image source={icons.share} />
          <Text style={{marginLeft: 10, fontSize: 16, textDecorationLine: 'underline'}}>
            {translate.string(translationKeys.item.actions.shareBtn)}
          </Text>
        </View>
      );
    };

    return (
      <ShareButton content={content} renderShareIcon={renderShareIcon} />
    );
  }

  renderSwatches = (options: CommerceTypes.Option[]): React.ReactNode => {
    const { optionValues } = this.state;

    return (
      <View>
        {options.map((option, index) => {
          const defaultOption = find(optionValues, { name: option.id });

          if (Array.isArray(option.values) && option.values.length === 0) {
            return null;
          }

          this.sortOptions(option.values);

          return (
            <View key={index} style={{marginBottom: 15}}>
              <Text style={{fontWeight: 'bold'}}>{option.name}</Text>
              <ScrollView
                horizontal={true}
                style={styles.swatchContainer}
                showsHorizontalScrollIndicator={false}
              >
                <Swatches
                  key={index}
                  title={option.name}
                  items={option.values}
                  defaultValue={defaultOption ? defaultOption.value : undefined}
                  onChangeSwatch={this.updateOption(option.id)}
                  label={false}
                  textContainerStyle={{marginRight: 15}}
                  textStyle={{padding: 6}}
                />
              </ScrollView>
            </View>
          );
        })}
      </View>
    );
  }

  sortOptions = (values: CommerceTypes.OptionValue[]): CommerceTypes.OptionValue[] => {
    return values.sort((a, b): number => {
      const aVal = sortedOptions[a.name] || 0;
      const bVal = sortedOptions[b.name] || 0;

      return aVal - bVal;
    });
  }

  goToContact = () => {
    this.props.navigator.push({
      screen: 'Contact'
    });
  }

  // tslint:disable cyclomatic-complexity
  render(): JSX.Element {
    // TODO: Remove type assertion when we update this to match the commerce schema
    /* tslint:disable-next-line:no-unnecessary-type-assertion */
    const commerceData = this.props.commerceData as CommerceTypes.Product & { [key: string]: any };

    if (!commerceData) {
      return <Loading style={{ marginTop: 80 }} />;
    }

    const {
      brand,
      carousels = [],
      review,
      options,
      originalPrice,
      price,
      title,
      shipsMsg,
      description = '',
      images = []
    } = commerceData;

    const { variantImages } = this.state;

    // Update Image src (should be updated in ZoomCarousel component)
    const imagesSources = (variantImages || images).map((image: any) => {
      return { src: { uri: (image.uri || '').trim() } };
    });

    // Limit zoom carousel to a single image
    const singleImageSource = [imagesSources[0]];

    // Align zoom close button to bottom center. Set left to half of the screen width minus
    // half of the close button image width in order to achieve this.
    const zoomCloseButtonStyle = {
      bottom: 50,
      top: undefined,
      left: (this.screenWidth / 2) - 17
    };

    return (
      <View style={{flex: 1}}>
        <PSScreenWrapper
          needInSafeArea={true}
          hideGlobalBanner={true}
          navigator={this.props.navigator}
        >
          <View style={{flex: 1}}>
            <View style={styles.bottomPadding}>
              <ZoomCarousel
                images={singleImageSource}
                dotStyle={styles.zoomCarouselDotStyle}
                dotActiveStyle={styles.zoomCarouselDotActiveStyle}
                renderZoomButton={this._renderZoomButton}
                zoomButtonStyle={styles.zoomCarouselZoomButtonStyle}
                closeButtonStyle={zoomCloseButtonStyle}
              />
            </View>
            <View style={styles.edgePadding}>
              <View style={styles.titleContainer}>
                <View style={styles.titleContainerLeft}>
                  {brand && <Text style={styles.brand}>{brand}</Text>}
                  <Text style={styles.title}>{title}</Text>
                </View>
              </View>
              {shipsMsg && (
                <Text style={styles.shipsMsg}>{shipsMsg}</Text>
              )}
              <View style={{ paddingBottom: 20 }}>
                <View style={[styles.row, { justifyContent: 'space-between' }]}>
                  <View style={[styles.row, { alignItems: 'center' }]}>
                    {!!originalPrice && (
                      <Text style={styles.originalPrice}>
                        {translate.currency(originalPrice)}
                      </Text>
                    )}
                    {price && <Text style={styles.price}>
                      {translate.currency(price)}
                    </Text>}
                  </View>
                  {review &&
                    review.statistics && (
                      <View>
                        <TouchableOpacity
                          style={[styles.row, { alignItems: 'flex-end' }]}
                          onPress={this.openReviews}
                        >
                          <ReviewIndicator
                            value={review.statistics.averageRating}
                            itemSize={18}
                          />
                          <Text
                            style={{
                              paddingLeft: 8,
                              fontWeight: '700',
                              fontSize: 12,
                              color: variables.palette.secondary
                            }}
                          >
                            {review.statistics.averageRating.toFixed(1)}
                          </Text>
                          <Text style={{ paddingLeft: 8, fontSize: 12 }}>
                            ({review.statistics.reviewCount})
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                </View>
              </View>
            </View>
            <View style={styles.edgePadding}>
              {options && this.renderSwatches(options)}
              <View style={styles.quantityView} />
            </View>
            <View style={styles.bottomPadding}>
              <Accordion
                title={
                  <Text style={GlobalStyle.h2}>
                    {translate.string(translationKeys.screens.productDetail.details)}
                  </Text>}
                content={
                  <PSHTMLView
                    html={description}
                    stylesheet={{
                      div: {
                        fontSize: 15
                      },
                      li: {
                        fontSize: 13,
                        paddingTop: 2
                      }
                    }}
                  />}
              />
            </View>
            <View style={styles.bottomPadding}>
              <Accordion
                title={
                  <Text style={GlobalStyle.h2}>
                    {translate.string(translationKeys.screens.productDetail.shippingReturns)}
                  </Text>}
                content={
                  <View style={{marginBottom: 10}}>
                    <Text style={{marginBottom: 10}}>
                      Free fast shipping on orders $25+ within the continental US.
                      Order by 5 p.m. for two business day delivery.
                    </Text>
                    <Text style={{marginBottom: 10}}>
                      Free returns up to 90 days after delivery.
                    </Text>
                    <TouchableOpacity onPress={this.goToContact}>
                      <Text style={{textDecorationLine: 'underline'}}>
                        View Details
                      </Text>
                    </TouchableOpacity>
                  </View>}
              />
            </View>
            <View style={styles.bottomPadding}>
              {this.renderShareButton()}
            </View>
            {carousels.map(this._renderCarousels)}
            {this.state.modalContent && (
              <PSModal
                visible={this.state.modalVisible}
                title={this.state.modalTitle}
                content={this.state.modalContent}
                onClose={this.closeModal}
              />
            )}
            {this.state.miniModalContent && (
              <PSModal
                visible={this.state.miniModalVisible}
                content={this.state.miniModalContent}
                onClose={this.closeMiniModal}
                fullscreen={false}
                backdropPress={this.closeMiniModal}
                backdropOpacity={0}
              />
            )}
          </View>
          {this.renderPromoProducts()}
        </PSScreenWrapper>
        {this._renderAddToCartButton()}
      </View>
    );
  }

  renderPromoProducts = (): React.ReactNode => {
    if (
      !(
        this.props.promoProducts &&
        this.props.promoProducts.products &&
        projectEnv.dataSource &&
        projectEnv.dataSource.promoProducts
      )
    ) {
      return null;
    }

    return (
      <View>
        <Text style={[GlobalStyle.h2, styles.sectionTitle]}>
          {projectEnv.dataSource.promoProducts.title}
        </Text>
        <View style={styles.shopButtonsContainer}>
          <PSProductCarousel
            items={this.props.promoProducts.products.map(prod => ({
              ...prod,
              image: (prod.images || []).find(img => !!img.uri),
              onPress: this.handlePromotedProductPress(prod.id),
              key: prod.id
            }))}
          />
        </View>
      </View>
    );
  }

  handlePromotedProductPress = (productId: string) => () => {
    this.props.navigator.push({
      screen: 'ProductDetail',
      passProps: {
        productId
      }
    });
  }

  _renderCarousels = (carousel: any, index: number) => {
    return (
      <View key={index}>
        <Text style={styles.carouselTitle}>{carousel.title}</Text>
        <PSProductCarousel
          style={styles.productCarousel}
          items={carousel.products.map((prod: any) => ({
            ...prod,
            image: { uri: prod.image },
            onPress: this.goToProduct(prod)
          }))}
        />
      </View>
    );
  }

  openWebView = (url: string, title: string) => () => {
    this.props.navigator.push({
      screen: 'DesktopPassthrough',
      title,
      passProps: {
        url
      }
    });
  }

  _renderZoomButton = (openZoom: () => void): JSX.Element => {
    return (
      <TouchableOpacity onPress={openZoom}>
        <Image resizeMode='contain' source={icons.zoom} />
      </TouchableOpacity>
    );
  }

  _renderStepper = (): JSX.Element => {
    return (
      <PSStepper
        minimumQuantity={1}
        initialQuantity={1}
        onChange={this.changeQty}
      />
    );
  }

  _renderAddToCartButton = (): JSX.Element => {
    const { variantInStock } = this.state;
    let content: JSX.Element;

    if (variantInStock) {
      content = (
        <PSButton
          style={{ height: 50, justifyContent: 'center' }}
          title={translate.string(translationKeys.item.actions.addToCart.actionBtn)}
          onPress={this.addToCart}
          titleStyle={{
            fontWeight: '600',
            fontSize: 17,
            color: 'white'
          }}
          underlayColor='#7f7f7f'
        />
      );
    } else {
      const msg1 = 'Out of Stock';
      const msg2 = 'Please select another size and/or color';
      content = (
        <View style={styles.outOfStockContainer}>
          <Text style={[styles.outOfStockMessage, { fontSize: 16 }]}>{msg1}</Text>
          <Text style={styles.outOfStockMessage}>{msg2}</Text>
        </View>
      );
    }

    return (
      <View style={{ padding: 5, marginTop: 5, backgroundColor: '#efefef' }}>{content}</View>
    );
  }

  openReviews = () => {
    const { commerceData } = this.props;

    if (commerceData && commerceData.review) {
      this.navigateToScreen(
        'ProductDetailReviews',
        'Reviews (' + commerceData.review.total + ')',
        {
          reviewQuery: { ids: commerceData.id }
        }
      );
    }
  }

  navigateToScreen = (screen: string, title: string, props: any) => {
    this.props.navigator.push({
      screen,
      title,
      passProps: props
    });
  }
}

export const PSProductDetail = withProductDetailData<UnwrappedPSProductDetailProps>(
  async (DataSource: CommerceDataSource, props: UnwrappedPSProductDetailProps) =>
    DataSource.fetchProduct(props.id)
  // TODO: Update cart provider to separate out types correctly
)(withCart(PSProductDetailComponent as any) as any);

import AsyncStorage from '@react-native-community/async-storage';

import {
  CommerceDataSource,
  CommerceTypes
} from '@brandingbrand/fscommerce';

import { STORAGE_KEYS } from '../lib/constants';

import { env } from '@brandingbrand/fsapp';

import FSNetwork from '@brandingbrand/fsnetwork';
import Decimal from 'decimal.js';

const kErrorMessageNotImplemented = 'not implemented';

export default class EpiserverDataSource implements CommerceDataSource {
  client: FSNetwork;
  minRefinements: number = 0;

  constructor(apiHost: string) {
    this.client = new FSNetwork({
      baseURL: apiHost + '/api'
    });
  }

  async fetchProduct(id: string): Promise<CommerceTypes.Product> {
    const response = await this.client.get(`/products/${id}`);

    return response.data;
  }

  async setGiftWrapOnItem(
    itemId: string,
    enabled: boolean
  ): Promise<CommerceTypes.Cart> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async fetchProductIndex(
    query: CommerceTypes.ProductQuery
  ): Promise<CommerceTypes.ProductIndex> {
    if (!query.categoryId) {
      throw new Error('categoryId needs to be provided to fetch product index');
    }

    const response = await this.client.get(`/categories/${query.categoryId}/products`);

    return response.data;
  }

  async fetchCategory(
    id?: string,
    query?: CommerceTypes.CategoryQuery
  ): Promise<CommerceTypes.Category> {
    let response;
    if (id) {
      const url = id === 'episerver-top'
        ? `/catalogs/Fashion`
        : `/categories/${id}`;
      response = await this.client.get(url);
    } else {
      response = await this.client.get(`/catalogs/${env.dataSource.catalogName}`);
    }

    return response.data;
  }

  async fetchCart(
    query?: CommerceTypes.CartQuery
  ): Promise<CommerceTypes.Cart> {
    const cart = await this.getStoredCartOrEmptyCart();
    let subtotal = new Decimal(0);

    cart.items.forEach(item => {
      if (item.price) {
        subtotal = subtotal.add(new Decimal(item.price.value).mul(item.quantity));
      }
    });

    return {
      ...cart,
      subtotal: {
        value: subtotal,
        currencyCode: 'USD'
      },
      tax: {
        value: new Decimal(0),
        currencyCode: 'USD'
      },
      total: {
        value: subtotal,
        currencyCode: 'USD'
      }
    };
  }

  async addToCart(
    id: string,
    qty: number = 1,
    product?: CommerceTypes.Product
  ): Promise<CommerceTypes.Cart> {
    const cart = await this.getStoredCartOrEmptyCart();
    if (!product) {
      return cart;
    }

    const matchingItem = cart.items.find(item => item.itemId === id);

    if (matchingItem) {
      matchingItem.quantity = matchingItem.quantity + qty;
    } else {
      const variant: CommerceTypes.Variant = (product.variants || [])
        .find(variant => variant.id === id) || { id: '', optionValues: []};
      const options = variant.optionValues.map(val => ({
        id: val.name,
        name: val.name,
        values: [{
          name: val.value,
          value: val.value
        }]
      }));

      cart.items.push({
        itemId: id,
        productId: id,
        quantity: qty,
        handle: product.handle || id,
        title: variant.title || product.title,
        images: variant.images || product.images,
        price: variant.price || product.price,
        options: options.length > 0 ? options : product.options
      });
    }

    await AsyncStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));

    return cart;
  }

  async search(
    keyword: string,
    query: CommerceTypes.ProductQuery
  ): Promise<CommerceTypes.ProductIndex> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async searchSuggestion(
    keyword: string
  ): Promise<CommerceTypes.SearchSuggestion> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async removeCartItem(itemId: string): Promise<CommerceTypes.Cart> {
    const cart = await this.getStoredCartOrEmptyCart();

    for (let idx = 0; idx < cart.items.length; ++idx) {
      const item = cart.items[idx];

      if (item.itemId === itemId) {
        cart.items.splice(idx, 1);

        break;
      }
    }

    await AsyncStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));

    return this.fetchCart();
  }

  async updateCartItemQty(
    itemId: string,
    qty: number
  ): Promise<CommerceTypes.Cart> {
    if (qty === 0) {
      return this.removeCartItem(itemId);
    }

    const cart = await this.getStoredCartOrEmptyCart();

    cart.items.forEach(item => {
      if (item.itemId === itemId) {
        item.quantity = qty;
      }
    });

    await AsyncStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));

    return this.fetchCart();
  }

  async updateCartItemShipping(
    itemId: string,
    value: string
  ): Promise<CommerceTypes.Cart> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async login(
    username: string,
    password: string
  ): Promise<CommerceTypes.SessionToken> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async logout(): Promise<boolean> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async register(
    account: CommerceTypes.CustomerAccount,
    password: string
  ): Promise<CommerceTypes.CustomerAccount> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async fetchSavedAddresses(): Promise<CommerceTypes.CustomerAddress[]> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async addSavedAddress(
    address: CommerceTypes.CustomerAddress
  ): Promise<CommerceTypes.CustomerAddress> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async editSavedAddress(
    address: CommerceTypes.CustomerAddress
  ): Promise<CommerceTypes.CustomerAddress> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async deleteSavedAddress(addressId: string): Promise<boolean> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async fetchSavedPayments(
    methodId?: string
  ): Promise<CommerceTypes.PaymentMethod[]> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async addSavedPayment(
    payment: CommerceTypes.PaymentMethod
  ): Promise<CommerceTypes.PaymentMethod> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async editSavedPayment(payment: any): Promise<any> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async deleteSavedPayment(paymentId: string): Promise<boolean> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async forgotPassword(email: string): Promise<boolean> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async fetchAccount(): Promise<CommerceTypes.CustomerAccount> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async updateAccount(
    account: CommerceTypes.CustomerAccount
  ): Promise<CommerceTypes.CustomerAccount> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async updatePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async fetchOrders(): Promise<CommerceTypes.Order[]> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async fetchOrder(orderId: string): Promise<CommerceTypes.Order> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async addItemToWishlist(id: string): Promise<any> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async fetchProductRecommendations(id: string): Promise<CommerceTypes.Product[]> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async fetchPaymentMethods(
    cartId: string
  ): Promise<CommerceTypes.ApplicablePayment[]> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async fetchShippingMethods(
    cartId: string,
    shipmentId: string
  ): Promise<CommerceTypes.ShippingMethodResponse> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async applyPromo(promoCode: string): Promise<CommerceTypes.Cart> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async removePromo(promoItemId: string): Promise<CommerceTypes.Cart> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async setBillingAddress(
    options: CommerceTypes.BillingAddressOptions
  ): Promise<CommerceTypes.Cart> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async setCustomerInfo(
    options: CommerceTypes.CustomerInfoOptions
  ): Promise<CommerceTypes.Cart> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async setShipmentAddress(
    options: CommerceTypes.ShipmentAddressOptions
  ): Promise<CommerceTypes.Cart> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async setShipmentMethod(
    options: CommerceTypes.ShipmentMethodOptions
  ): Promise<CommerceTypes.Cart> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async updateGiftOptions(
    options: CommerceTypes.GiftOptions
  ): Promise<CommerceTypes.Cart> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async addPayment(
    cartId: string,
    payment: CommerceTypes.Payment
  ): Promise<CommerceTypes.Cart> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async updatePayment(
    cartId: string,
    paymentId: string,
    payment: CommerceTypes.Payment
  ): Promise<CommerceTypes.Cart> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async submitOrder(cartId: string): Promise<CommerceTypes.Order> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async updateOrder(order: CommerceTypes.Order): Promise<CommerceTypes.Order> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async updateOrderPayment(
    orderId: string,
    paymentId: string,
    payment: CommerceTypes.Payment
  ): Promise<CommerceTypes.Order> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async destroyCart(): Promise<void> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async emailSignup(email: string): Promise<void> {
    throw new Error(kErrorMessageNotImplemented);
  }

  private async getStoredCartOrEmptyCart(): Promise<CommerceTypes.Cart> {
    const cartJson = await AsyncStorage.getItem(STORAGE_KEYS.cart);

    let cart: CommerceTypes.Cart = {
      items: []
    };

    if (cartJson) {
      try {
        cart = JSON.parse(cartJson);
      } catch (e) {
        console.warn('error parsing cart json', e);
      }
    }

    return cart;
  }
}

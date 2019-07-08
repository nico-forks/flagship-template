import { CommerceTypes } from '@brandingbrand/fscommerce';
import { Dictionary } from '@brandingbrand/fsfoundation';
import { DemandwareTypes } from '@brandingbrand/fssalesforce';

export const commerceCloudMiddleware = {
  fetchCategory: (data: any, normalized: CommerceTypes.Category): CommerceTypes.Category => {
    // Determine which categories to show by comparing the normalized subcategories against the
    // raw data, in which categories meant to be displayed will have c_showInMenu set to true.
    const categoriesToShow = (data.categories || [])
      .filter((category: any) => category.c_showInMenu)
      .map((category: any) => category.id);

    // c_showInMenu may only be a custom field within the Demandware demo API, so only filter the
    // categories if at least one category has c_showInMenu set to true. This will prevent all
    // categories from being hidden if a future Demandware API doesn't implement c_showInMenu.
    if (categoriesToShow.length > 0) {
      normalized.categories = (normalized.categories || []).filter(
        (category: CommerceTypes.Category) => categoriesToShow.indexOf(category.id) > -1
      );
    }

    return normalized;
  },
  fetchProduct: (data: any, normalized: CommerceTypes.Product): CommerceTypes.Product => {
    if (!normalized.description) {
      normalized.description = (data.long_description || '').replace(/\s+<li/g, '<li');
    }

    return normalized;
  },
  fetchCart: (
    data: DemandwareTypes.BasketWithProductDetails,
    normalized: CommerceTypes.Cart
  ): CommerceTypes.Cart => {
    if (!Array.isArray(data.product_details) || !Array.isArray(normalized.items)) {
      return normalized;
    }

    const indexedItems = data.product_details.reduce<Dictionary<CommerceTypes.Product>>(
      (dict, prod) => ({...dict, [prod.id]: prod})
    , {});

    return {
      ...normalized,
      items: normalized.items.map(item => {
        const variant = (indexedItems[item.productId].variants || [])
          .find(variant => variant.id === item.productId);

        if (!variant) {
          return item;
        }

        const optionVals = variant.optionValues.reduce<Dictionary<string>>((vals, val) => {
          return {
            ...vals,
            [val.name]: val.value
          };
        }, {});

        return {
          ...item,
          options: (indexedItems[item.productId].options || []).map(option => ({
            ...option,
            values: option.values.filter(({ value }) => value === optionVals[option.id])
          }))
        };
      })
    };
  }
};


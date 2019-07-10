import { PAGES_LOADED, PAGES_LOADING, PAGES_LOADING_ERROR } from '../lib/constants';

const INITIAL_STATE: PagesStore = {
  loading: false,
  value: undefined
};

export interface PagesStore {
  loading: boolean;
  value: any;
}

export default function pagesReducer(
  pagesStore: PagesStore = INITIAL_STATE,
  action: any
): PagesStore {
  switch (action.type) {
    case PAGES_LOADED: {
      return {
        ...pagesStore,
        loading: false,
        value: action.value
      };
    }
    case PAGES_LOADING: {
      return {
        ...pagesStore,
        loading: true
      };
    }
    case PAGES_LOADING_ERROR: {
      return {
        ...pagesStore,
        loading: false
      };
    }
    default: {
      return pagesStore;
    }
  }
}

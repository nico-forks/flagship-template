import { fetchEngagementPages } from '../lib/appbuilder';
import { PAGES_LOADED, PAGES_LOADING, PAGES_LOADING_ERROR } from '../lib/constants';

export function fetchPages(dispatch: any): () => void {
  return () => {
    dispatch({ type: PAGES_LOADING });
    fetchEngagementPages()
      .then(result => dispatch({
        type: PAGES_LOADED,
        value: result
      }))
      .catch(e => {
        dispatch({ type: PAGES_LOADING_ERROR });
      });
  };
}
